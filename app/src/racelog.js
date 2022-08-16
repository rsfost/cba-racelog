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
            db.createObjectStore("races", {
                keyPath: "id",
                autoIncrement: false
            });
        };
    });
}

export async function getAll() {
    return new Promise((resolve, reject) => {
        const req = objectStore().getAll();
        req.onsuccess = (event) => {
            resolve(event.target.result);
        };
    });
};

function transaction(){
    const tx = db.transaction(["races"], "readwrite");
    return tx;
};

function objectStore(tx) {
    tx = tx || transaction();
    const objectStore = tx.objectStore("races");
    return objectStore;
};

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

function fillDb(callback) {
    const fetchRacelog = fetch('./data/racelog.json').then((resp) => resp.json());
    fetchRacelog.then(data => {
        const tx = transaction();
        const decrementLatch = (() => {
            let latch = data.values.length - 1;
            return () => {
                if (--latch <= 0) {
                    callback();
                }
            };
        })();
        for (let i = 1; i < data.values.length; ++i) {
            const addReq = objectStore(tx).add({
                id: i,
                ...mapRow(data.values[i])
            });
            addReq.onsuccess = (event) => decrementLatch();
            addReq.onerror = (event) => decrementLatch();
        }
    });
}
