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
  req.onerror = e => console.error("DB init error", e);
}

function addQuestion(rec, cb) {
  const tx = db.transaction("questions", "readwrite");
  tx.objectStore("questions").add(rec);
  tx.oncomplete = () => cb && cb();
}

function getQuestionsByCourse(courseId, cb) {
  const list = [];
  const store = db.transaction("questions", "readonly").objectStore("questions");
  store.openCursor().onsuccess = e => {
    const cur = e.target.result;
    if (!cur) return cb(list);
    if (cur.value.courseId === courseId) list.push(cur.value);
    cur.continue();
  };
}

function getAllQuestions(cb) {
  const list = [];
  const store = db.transaction("questions", "readonly").objectStore("questions");
  store.openCursor().onsuccess = e => {
    const cur = e.target.result;
    if (!cur) return cb(list);
    list.push(cur.value);
    cur.continue();
  };
}

function answerQuestion(qid, answer, cb) {
  const tx = db.transaction("questions", "readwrite");
  const store = tx.objectStore("questions");
  store.get(qid).onsuccess = e => {
    const rec = e.target.result;
    rec.answer = answer;
    store.put(rec);
    tx.oncomplete = () => cb && cb();
  };
}