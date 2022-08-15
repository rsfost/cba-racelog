let db;
const DB_VERSION = 1;

function mapRow(row) {
    return {
        date: row[0],
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

function transaction() {
    const tx = db.transaction(["races"], "readwrite");
    return tx;
}

function objectStore(tx) {
    tx = tx || transaction();
    const objectStore = tx.objectStore("races");
    return objectStore;
}

function fillDb() {
    const fetchRacelog = fetch('./data/racelog.json').then((resp) => resp.json());
    const clearReq = objectStore().clear();
    clearReq.onsuccess = (event) => {
        fetchRacelog.then(racelog => {
            const tx = transaction();
            for (let i = 0; i < racelog.values.length; ++i) {
                objectStore(tx).add({
                    id: i,
                    ...mapRow(racelog.values[i])
                });
            }
        });
    }
}

function init() {
    const req = window.indexedDB.open("racelog", DB_VERSION);
    req.onerror = (event) => {
        console.log(event);
    };
    req.onsuccess = (event) => {
        db = event.target.result;
        fillDb();
    };
    req.onupgradeneeded = (event) => {
        const db = event.target.result;
        db.createObjectStore("races", {
            keyPath: "id",
            autoIncrement: false
        });
    };
}

init();
