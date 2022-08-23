let db;

function createLatch(callback, countStart) {
    let latch = countStart;
    return () => {
        if (--latch <= 0) {
            callback();
        }
    };
}

function transaction(){
    const tx = db.transaction(["racedays"], "readwrite");
    return tx;
};

function objectStore(tx) {
    tx = tx || transaction();
    const objectStore = tx.objectStore("racedays");
    return objectStore;
};

(async function() {
    const resp = await fetch('/data/racelog.json');
    const racelog = await resp.json();
    const req = indexedDB.open("racelog", 1);
    req.onerror = (event) => {
        console.log(event);
    };
    req.onsuccess = (event) => {
        db = event.target.result;
        objectStore().clear().onsuccess = (event) => {
            const tx = transaction();
            const latch = createLatch(function() {
                postMessage('done');
            }, racelog.length);
            racelog.forEach((raceDay, index) => {
                const addReq = objectStore(tx).add({
                    id: index,
                    ...raceDay
                });
                addReq.onsuccess = (event) => latch();
                addReq.onerror = (event) => latch();
            });
        };
    };
})();
