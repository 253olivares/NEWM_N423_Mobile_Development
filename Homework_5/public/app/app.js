var _db;

var albumDisplay = "";

function initFirebase() {
    firebase.auth().signInAnonymously()
    .then(() => {
      _db = firebase.firestore();
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      _db = [];
    });
}

function displayAlbums(){
    _db
    .collection("Albums")
    .get()
    .then(function(querySnapshot){
        querySnapshot.forEach(function(doc){
            console.log(doc.data())
        });
    });
}


$(document).ready(function () {
    try{
        let app = firebase.app();
        initFirebase();
        displayAlbums();
    } catch {
        console.error(e);
    }
});