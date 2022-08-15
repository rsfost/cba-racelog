(function() {
    let db;
    const DB_VERSION = 1;

    racelog.init = function(callback) {
        const req = window.indexedDB.open("racelog", DB_VERSION);
        req.onerror = (event) => {
            console.log(event);
        };
        req.onsuccess = (event) => {
            db = event.target.result;
            racelog.objectStore().clear().onsuccess = (event) => {
                fillDb(callback);
            };
        };
        req.onupgradeneeded = (event) => {
            const db = event.target.result;
            db.createObjectStore("races", {
                keyPath: "id",
                autoIncrement: false
            });
        };
    };

    racelog.transaction = function() {
        const tx = db.transaction(["races"], "readwrite");
        return tx;
    };

    racelog.objectStore = function(tx) {
        tx = tx || racelog.transaction();
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
            const tx = racelog.transaction();
            const decrementLatch = (() => {
                let latch = data.values.length;
                return () => {
                    if (--latch <= 0) {
                        callback();
                    }
                };
            })();
            for (let i = 0; i < data.values.length; ++i) {
                const addReq = racelog.objectStore(tx).add({
                    id: i,
                    ...mapRow(data.values[i])
                });
                addReq.onsuccess = (event) => decrementLatch();
                addReq.onerror = (event) => decrementLatch();
            }
        });
    }
})(window.racelog = window.racelog || {}, undefined);
