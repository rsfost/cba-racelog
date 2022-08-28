let db;
import { initdb, objectStore, transaction } from '@/db'

function createLatch(callback, countStart) {
    let latch = countStart;
    return () => {
        if (--latch <= 0) {
            callback();
        }
    };
}

(async function() {
    const resp = await fetch('/data/racelog.json');
    const racelog = await resp.json();
    await initdb();
    objectStore(undefined, "readwrite").clear().onsuccess = (event) => {
        const tx = transaction("readwrite");
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
})();
