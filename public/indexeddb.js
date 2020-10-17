let db;
let dbReq = indexedDB.open('budgetDatabase', 1);
dbReq.onupgradeneeded = function(event) {
  // Set the db variable to our database so we can use it!  
  db = event.target.result;

  // Create an object store named notes. Object stores
  // in databases are where data are stored.
  let budgetRecord = db.createObjectStore('record', {autoIncrement: true});
}
dbReq.onsuccess = function(event) {
  db = event.target.result;
}
dbReq.onerror = function(event) {
  alert('error opening database ' + event.target.errorCode);
}

function saveRecord(transaction) {
    // Start a database transaction and get the record object store
    let tx = db.transaction(['record'], 'readwrite');
    let store = tx.objectStore('record');
    // Put the budget transaction into the object store
    let record = transaction;
    store.add(record);
    // Wait for the database transaction to complete
    tx.oncomplete = function() { console.log('stored budget transaction!') }
    tx.onerror = function(event) {
      alert('error storing budget transaction ' + event.target.errorCode);
    }
  }

  function retrieveRecords(records) {
        var tx = db.transaction('record', 'readonly');
        var store = tx.objectStore('record');
        var allRecords = store.getAll();
        allRecords.onsuccess = function() {
            console.log("allRecords.result = ", allRecords.result);
            window.addEventListener('online', function(e) { 
                console.log('online'); 
                console.log("in navigator.online");
                allRecords.result.forEach(record => {
                    let recordkey = record.getKey()
                    console.log("recordkey = " + recordkey);    
                    sendOfflineTransaction(recordkey,record);
              });
              });
            return (allRecords.result);
        };
  }

  function deleteRecord(i) {
    console.log("in deleteRecord = " + i);
    var tx = db.transaction('record', 'readwrite');
    var store = tx.objectStore('record');
    var delRecord = store.delete(i+1);
    delRecord.onsuccess = function() {
        console.log("Delete Record complete");
        return;
    };
}
