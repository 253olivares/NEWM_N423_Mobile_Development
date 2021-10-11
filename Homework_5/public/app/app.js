var _db;

function initFirebase() {
    firebase
      .auth()
      .signInAnonymously()
      .then(() => {
        // signing in anonymously
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        _db = [];
      });
    _db = firebase.firestore();
  }

function loadAlbum(doc){
    _db
    .collection("Albums")
    .get()
    .then(function(querySnapshot){
        querySnapshot.forEach(function(doc){
            console.log(doc.data());
        });
    }, function(error){
        console.log("Error:", error);
    })
}




$(document).ready(function(){
    try {
        let app = firebase.app();
        initFirebase();
        loadAlbum();
      } catch {
        console.error("failed to load functions");
      }
})
