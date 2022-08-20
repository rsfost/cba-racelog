export const name = 'racelog';

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
        position: row[9]
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
