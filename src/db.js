export const name = "db";

let db;

export function initdb() {
    return new Promise((resolve, reject) => {
        const req = indexedDB.open('racelog');
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
            resolve(db);
        }
    });
}

export function transaction(scope = "readonly"){
    const tx = db.transaction(["racedays"], scope);
    return tx;
}

export function objectStore(tx, scope = "readonly") {
    tx = tx || transaction(scope);
    const objectStore = tx.objectStore("racedays");
    return objectStore;
}

export function forEach(keyRange, func) {
    return new Promise((resolve, reject) => {
        const req = objectStore().openCursor(keyRange);
        req.onsuccess = (event) => {
            const cursor = event.target.result;
            if (!cursor) {
                resolve();
                return;
            }
            func(cursor.value);
            cursor.continue();
        };
    });
}
