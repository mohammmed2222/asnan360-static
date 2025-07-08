// assets/js/db.js
let db;
function initDB(cb) {
  const req = indexedDB.open("Asnan360DB", 1);
  req.onupgradeneeded = e => {
    db = e.target.result;
    if (!db.objectStoreNames.contains("questions")) {
      db.createObjectStore("questions", { keyPath: "qid", autoIncrement: true });
    }
  };
  req.onsuccess = e => {
    db = e.target.result;
    cb && cb();
  };
  req.onerror = e => console.error("DB failed", e);
}
function getAllQuestions(cb) {
  const list = [];
  const store = db.transaction("questions","readonly").objectStore("questions");
  store.openCursor().onsuccess = e => {
    const cur = e.target.result;
    if (cur) { list.push(cur.value); cur.continue(); }
    else cb(list);
  };
}
function answerQuestion(qid, answer, cb) {
  const tx = db.transaction("questions","readwrite");
  const store = tx.objectStore("questions");
  store.get(qid).onsuccess = ev => {
    const rec = ev.target.result;
    rec.answer = answer;
    store.put(rec);
    tx.oncomplete = () => cb && cb();
  };
}