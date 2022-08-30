import { initdb, forEach, get } from '@/db'

const init = initdb();

// Size of list to return for each statistic.
const LIST_SIZE = 5;

// The range over which statistics will be calculated for a particular day.
const WEEK_RANGE = 52;

// Minimum race participation over WEEK_RANGE
const MIN_OVERALL_ACTIVITY = 50;

// Range to use for "recent" race participation requirements.
const RECENT_WEEK_RANGE = 5;

// Minimum race participation over specified RECENT_WEEK_RANGE range
const MIN_RECENT_ACTIVITY = 1;

// Minimum sleeper pick activity over WEEK_RANGE
const MIN_SLEEPER_ACTIVITY = 20;

// Minimum captain activity over WEEK_RANGE
const MIN_CAPTAIN_ACTIVITY = 10;

function normalizeName(name) {
    // TODO: Known alts? ;)
    return name.toLowerCase().replace(/[_-]/g, ' ');
}

function round(num) {
    return Math.round((num + Number.EPSILON) * 1000) / 1000;
}

function weekDiff(date1, date2) {
    const MILLIS_PER_WEEK = 6.048e8;
    const diffMillis = date1 - date2;
    const diffWeeks = diffMillis / MILLIS_PER_WEEK;
    return Math.trunc(diffWeeks);
}

onmessage = async function(e) {
    await init;

    const id = e.data;
    const keyRange = IDBKeyRange.bound(id, id + WEEK_RANGE, false, true);

    const today = (await get(id) || { date: undefined }).date;
    if (!today) {
        postMessage({});
        return;
    }

    // player -> stats
    const stats = {};
    const incrementPlayer = (player, date, isWin, pick) => {
        const normalName = normalizeName(player);
        let stat = stats[normalName];
        if (!stat) {
            stats[normalName] = (stat = {
                player,
                pickWins: [0, 0, 0, 0, 0],
                pickTotal: [0, 0, 0, 0, 0],
                activity: 0,
                sleeperActivity: 0
            });
        }
        ++stat.pickTotal[pick];
        if (isWin) ++stat.pickWins[pick];
        if (weekDiff(today, date) <= RECENT_WEEK_RANGE) {
            ++stat.activity;
            if (pick > 2) {
                ++stat.sleeperActivity;
            }
        }
    };
    const incrementTeam = (team, isWin) => {
        incrementPlayer(team.captain, team.date, isWin, 0);
        incrementPlayer(team.pick1, team.date, isWin, 1);
        incrementPlayer(team.pick2, team.date, isWin, 2);
        incrementPlayer(team.pick3, team.date, isWin, 3);
        incrementPlayer(team.pick4,team.date, isWin, 4);
    };
    await forEach(keyRange, raceday => {
        raceday.races.forEach(race => {
            const winner = race.shift();
            if (!winner) return;
            incrementTeam(winner, true);
            race.forEach(team => {
                incrementTeam(team, false);
            });
        });
    });
    Object.values(stats).forEach(stat => {
        stat.total = stat.pickTotal.reduce((a, b) => a + b);
        stat.wins = stat.pickWins.reduce((a, b) => a + b);
        stat.winrate = round(stat.wins / stat.total);
        stat.pickWinrate = stat.pickWins.map((wins, i) => round(wins / (stat.pickTotal[i] || 1)));

        stat.sleeperTotal = stat.pickTotal[3] + stat.pickTotal[4];
        stat.sleeperWins = stat.pickWins[3] + stat.pickWins[4];
        stat.sleeperWinrate = stat.sleeperWins / (stat.sleeperTotal || 1);
    });
    const candidates = Object.values(stats)
        .filter(stat => stat.total >= MIN_OVERALL_ACTIVITY)
        .filter(stat => stat.activity >= MIN_RECENT_ACTIVITY);
    const topWins = candidates.sort((stat1, stat2) => stat2.wins - stat1.wins).slice(0, LIST_SIZE);
    const topWinrates = candidates.sort((stat1, stat2) => stat2.winrate - stat1.winrate).slice(0, LIST_SIZE);
    const topCaptains = candidates
        .filter(stat => stat.pickTotal[0] >= MIN_CAPTAIN_ACTIVITY)
        .sort((stat1, stat2) => stat2.pickWinrate[0] - stat1.pickWinrate[0]).slice(0, LIST_SIZE);

    const sleeperCandidates = Object.values(stats)
        .filter(stat => stat.sleeperTotal >= MIN_SLEEPER_ACTIVITY)
        .filter(stat => stat.sleeperActivity >= MIN_RECENT_ACTIVITY);
    const topSleepers = sleeperCandidates.sort((stat1, stat2) => stat2.sleeperWinrate - stat1.sleeperWinrate).slice(0, LIST_SIZE);

    postMessage({id, topWins, topWinrates, topCaptains, topSleepers});
}
