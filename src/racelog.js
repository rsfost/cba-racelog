export const name = 'racelog';

let db;

export async function init() {
    return new Promise((resolve, reject) => {
        const req = window.indexedDB.open('racelog');
        req.onupgradeneeded = (event) => {
            const db = event.target.result;
            const objectStore = db.createObjectStore("racedays", {
                keyPath: "id",
                autoIncrement: false
            });
            const dateIndex = objectStore.createIndex("date", "date", { unique: false });
        };
        req.onsuccess = (event) => {
            db = event.target.result;
            const worker = new Worker('/workers/init.js');
            worker.onmessage = (e) => {
                resolve();
            }
        }
    });
}

export async function getRaceDays(start = 0, count = 10) {
    return new Promise((resolve, reject) => {
        const keyRange = IDBKeyRange.bound(start, start + count, false, true);
        const req = objectStore().openCursor(keyRange);
        const returnValue = [];
        req.onsuccess = (event) => {
            const cursor = event.target.result;
            if (!cursor) {
                resolve(returnValue);
                return;
            }
            returnValue.push(decorate(cursor.value));
            cursor.continue();
        };
    });
}

function transaction(){
    const tx = db.transaction(["racedays"], "readonly");
    return tx;
}

function objectStore(tx) {
    tx = tx || transaction();
    const objectStore = tx.objectStore("racedays");
    return objectStore;
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
