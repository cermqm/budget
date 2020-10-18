let db;
let dbReq = indexedDB.open('budgetDatabase', 1);
var tx;
var store;
var allRecords;
var allKeys;
var record;

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


window.addEventListener('offline', function(e) { 
console.log('offline'); 
});

// window.addEventListener('load', function(e) {
//     console.log("in window load event");
//     tx = db.transaction(['record'], 'readonly');
//     store = tx.objectStore('record');
//     allRecords = store.getAll();
//     allKeys = store.getAllKeys();
//     allRecords.onsuccess = function() {
//         allKeys.onsuccess = function() {
//         console.log("allRecords = ", allRecords);
//         console.log("allKeys = ", allKeys);
//         console.log("allRecords.result = ", allRecords.result);
//         console.log('online'); 
//         console.log("in navigator.online");
//         allRecords.result.forEach((record, i)=> {
//             console.log("i in eventlistener = " + i);
//             console.log("record = ", record);
//             let recordkey = allKeys.result[i];
//             console.log("recordkey = " + recordkey);
//             sendofflineTransaction(recordkey,record);
//         });
//         };
//     };  
// });

window.addEventListener('online', function(e) { 
    console.log("in add event listener");
    tx = db.transaction('record', 'readonly');
    store = tx.objectStore('record');
    allRecords = store.getAll();
    allKeys = store.getAllKeys();
    allRecords.onsuccess = function() {
        allKeys.onsuccess = function() {
        console.log("allRecords = ", allRecords);
        console.log("allKeys = ", allKeys);
        console.log("allRecords.result = ", allRecords.result);
        console.log('online'); 
        console.log("in navigator.online");
        allRecords.result.forEach((record, i)=> {
            console.log("i in eventlistener = " + i);
            console.log("record = ", record);
            let recordkey = allKeys.result[i];
            console.log("recordkey = " + recordkey);
            sendOfflineTransaction(recordkey,record);
        });
        };
    };
});

  function deleteRecord(i) {
    console.log("in deleteRecord = " + i);
    tx = db.transaction('record', 'readwrite');
    store = tx.objectStore('record');
    var delRecord = store.delete(i);
    delRecord.onsuccess = function() {
        console.log("Delete Record complete");
        return;
    };
}
