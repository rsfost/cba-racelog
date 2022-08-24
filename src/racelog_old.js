export const name = 'racelog_old';

let db;
const DB_VERSION = 1;

export async function init() {
    return new Promise((resolve, reject) => {
        const req = window.indexedDB.open("racelog", DB_VERSION);
        req.onerror = (event) => {
            console.log(event);
            reject();
        };
        req.onsuccess = (event) => {
            db = event.target.result;
            objectStore().clear().onsuccess = (event) => {
                fillDb(resolve);
            };
        };
        req.onupgradeneeded = (event) => {
            const db = event.target.result;
            const objectStore = db.createObjectStore("teams", {
                keyPath: "id",
                autoIncrement: false
            });
            const dateIndex = objectStore.createIndex("date", "date", { unique: false });
        };
    });
}

export async function getTeams() {
    return new Promise((resolve, reject) => {
        const index = dateIndex(objectStore());
        const req = index.openCursor(undefined, 'prev');
        const returnValue = [];
        req.onsuccess = (event) => {
            const cursor = event.target.result;
            if (!cursor) {
                resolve(returnValue);
                return;
            }
            returnValue.push(cursor.value);
            cursor.continue();
        };
    });
};

export async function getRaceDays(start = 0, rows = 10000) {
    const teams = await getTeams();
    const returnValue = new Map();
    const appendRaceDay = currentTeams => {
        if (!currentTeams || currentTeams.length <= 0) return;
        const raceToTeams = groupBy(currentTeams, 'race');
        Object.values(raceToTeams).forEach(race => {
            race.sort((t1, t2) => {
                let pos1 = t1.position;
                let pos2 = t2.position;
                if (pos1 === 'DNF')
                    pos1 = 1000;
                if (pos2 === 'DNF')
                    pos2 = 1000;
                return pos1 - pos2;
            });
        });
        const raceKeys = Object.keys(raceToTeams);
        raceKeys.sort();
        const races = [];
        returnValue.set(currentTeams[0].date, races);
        raceKeys.forEach(key => {
            races.push(raceToTeams[key]);
        });
    };

    if (!teams || teams.length <= 0) {
        return returnValue;
    }

    // Iterate through teams array with assumption items are sorted by date
    // and build return value.
    let currentDate = teams[0].date;
    let currentTeams = [];
    const startTeam = (function() {
        let dayCount = 1;
        let i = 0;
        if (start <= 0)
            return 0;
        for (; i < teams.length; ++i) {
            const team = teams[i];
            const isNewDay = currentDate.getTime() !== team.date.getTime();
            if (isNewDay) {
                ++dayCount;
                currentDate = team.date;
                if (dayCount >= start) {
                    break;
                }
            }
        }
        return i;
    })();
    for (let i = startTeam; i < teams.length; ++i) {
        const team = teams[i];
        const isNewDay = currentDate.getTime() !== team.date.getTime();
        if (isNewDay) {
            appendRaceDay(currentTeams);
            currentTeams = [];
            currentDate = team.date;
            if (returnValue.size >= rows) {
                break;
            }
        }
        currentTeams.push(team);
    }
    appendRaceDay(currentTeams);
    return returnValue;
}

function groupBy(xs, key) {
    return xs.reduce(function(rv, x) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
}

function createLatch(callback, countStart) {
    let latch = countStart;
    return () => {
        if (--latch <= 0) {
            callback();
        }
    };
}

function transaction(){
    const tx = db.transaction(["teams"], "readwrite");
    return tx;
};

function objectStore(tx) {
    tx = tx || transaction();
    const objectStore = tx.objectStore("teams");
    return objectStore;
};

function dateIndex(store) {
    return store.index("date");
}

function mapRow(row) {
    // Parse date
    const datePattern = /(\d\d?)\/(\d\d?)\/(\d\d\d\d)/;
    let dateMatch = datePattern.exec(row[0]);
    if (!dateMatch) {
        dateMatch = ['1/1/1901', '1', '1', '1901'];
    }
    const date = new Date(
        parseInt(dateMatch[3]),
        parseInt(dateMatch[2]) - 1,
        parseInt(dateMatch[1]));
    const prettyDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;

    // Return model
    return {
        date: date,
        prettyDate: prettyDate,
        race: row[2],
        captain: row[3],
        pick1: row[4],
        pick2: row[5],
        pick3: row[6],
        pick4: row[7],
        time: row[8],
        position: parseInt(row[9]) || 'DNF'
    };
}

function fillDb(callback) {
    const fetchRacelog = fetch('./data/racelog.json').then((resp) => resp.json());
    fetchRacelog.then(data => {
        const tx = transaction();
        const latch = createLatch(callback, data.values.length - 1);
        for (let i = 1; i < data.values.length; ++i) {
            const addReq = objectStore(tx).add({
                id: i,
                ...mapRow(data.values[i])
            });
            addReq.onsuccess = (event) => latch();
            addReq.onerror = (event) => latch();
        }
    });
}