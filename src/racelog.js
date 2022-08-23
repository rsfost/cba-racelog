export const name = 'racelog';

let racelog;

export async function init() {
    const resp = await fetch('./data/racelog.json');
    racelog = await resp.json();
}

export function getRaceDays(start = 0, count = 10) {
    return racelog
        .slice(start, start + count)
        .map((raceDay, id) => decorate(raceDay, id));
}

function decorate(raceDay, id) {
    const mvp = calcMvp(raceDay);
    return {
        ...raceDay,
        mvp: calcMvp(raceDay)
    };
}

function normalizeName(name) {
    // TODO: Known alts? ;)
    return name.toLowerCase().replace(/[_-]/g, ' ');
}

function calcMvp(raceDay) {
    const winCounts = {};
    const increment = player => {
        const normalName = normalizeName(player);
        let winCount = winCounts[normalName];
        if (!winCount) {
            winCounts[normalName] = (winCount = { player, wins: 0 });
        }
        ++winCount.wins;
    };
    raceDay.races.map(race => race[0]).forEach(team => {
        increment(team.captain);
        increment(team.pick1);
        increment(team.pick2);
        increment(team.pick3);
        increment(team.pick4);
    });
    const sortedWins = Object.values(winCounts).sort((wins1, wins2) => {
        let diff = wins2.wins - wins1.wins;
        if (diff == 0) {
            diff = wins1.player.localeCompare(wins2.player);
        }
        return diff;
    });
    const maxWins = sortedWins[0].wins;
    sortedWins.splice(sortedWins.findIndex(wins => wins.wins < maxWins));
    return {
        wins: maxWins,
        players: sortedWins.map(wins => wins.player)
    };
}
