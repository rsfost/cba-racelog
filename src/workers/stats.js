import { initdb, objectStore, transaction} from '@/db'
import { forEach } from '../db';

const init = initdb();

const WEEKS_PER_YEAR = 52;

function normalizeName(name) {
    // TODO: Known alts? ;)
    return name.toLowerCase().replace(/[_-]/g, ' ');
}

function round(num) {
    return Math.round((num + Number.EPSILON) * 100) / 100;
}

onmessage = async function(e) {
    await init;

    const id = e.data;
    const keyRange = IDBKeyRange.bound(id, id + WEEKS_PER_YEAR, false, true);

    // player -> stats
    const stats = {};
    const incrementPlayer = (player, isWin, pick) => {
        const normalName = normalizeName(player);
        let stat = stats[normalName];
        if (!stat) {
            stats[normalName] = (stat = {
                player, pickWins: [0, 0, 0, 0, 0], pickTotal: [0, 0, 0, 0, 0] });
        }
        ++stat.pickTotal[pick];
        if (isWin) ++stat.pickWins[pick];
    };
    const incrementTeam = (team, isWin) => {
        incrementPlayer(team.captain, isWin, 0);
        incrementPlayer(team.pick1, isWin, 1);
        incrementPlayer(team.pick2, isWin, 2);
        incrementPlayer(team.pick3, isWin, 3);
        incrementPlayer(team.pick4, isWin, 4);
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
        stat.pickWinrate = stat.pickWins.map((wins, i) => round(wins / stat.pickTotal[i]));
    });

    const candidates = Object.values(stats).filter(stat => stat.total > 50);
    const topWins = candidates.sort((stat1, stat2) => stat2.wins - stat1.wins).slice(0, 10);
    const topWinrates = candidates.sort((stat1, stat2) => stat2.winrate - stat1.winrate).slice(0, 10);
    const topCaptains = candidates.sort((stat1, stat2) => stat2.pickWinrate[0] - stat1.pickWinrate[0]).slice(0, 10);

    postMessage({topWins, topWinrates, topCaptains});
}
