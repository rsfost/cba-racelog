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

function parseDate(dateStr) {
    // dd/mm/yyyy -> Date
    let dateParts;
    dateStr = dateStr || '01/01/1901';
    dateParts = dateStr.split('/');
    if (!dateParts || dateParts.length < 3) {
        dateParts = ['01', '01', '1901'];
    }
    return new Date(dateParts[2], dateParts[1], dateParts[0]);
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
            raceDay.date = parseDate(raceDay.date);
            raceDay.races.forEach(race => {
                race.forEach(team => {
                    team.date = parseDate(team.date);
                });
            });
            const addReq = objectStore(tx).add({
                id: index,
                ...raceDay
            });
            addReq.onsuccess = (event) => latch();
            addReq.onerror = (event) => latch();
        });
    };
})();
