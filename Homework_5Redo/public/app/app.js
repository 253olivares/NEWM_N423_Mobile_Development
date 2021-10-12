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

function filterListen(){
    $(".hiphop").click(function(e){
        $(".albumContent").html("");
        _db
      .collection("Albums")
      .where("genre", "==", "Hip Hop")
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
            $(".albumContent").append(`
            <div class="album">
                <h1>${doc.data().albumName}</h1>
                <img src="${doc.data().albumPhoto}" alt="Album Image"> 
                <h3>${doc.data().artistName}</h3>
                <p>${doc.data().genre}</p>
            </div>
            `)
        });
      });
    })
    $(".indie").click(function(e){
        $(".albumContent").html("");
        _db
      .collection("Albums")
      .where("genre", "==", "Indie")
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
            $(".albumContent").append(`
            <div class="album">
                <h1>${doc.data().albumName}</h1>
                <img src="${doc.data().albumPhoto}" alt="Album Image"> 
                <h3>${doc.data().artistName}</h3>
                <p>${doc.data().genre}</p>
            </div>
            `)
        });
      });
    })
    $(".rap").click(function(e){
        $(".albumContent").html("");
        _db
      .collection("Albums")
      .where("genre", "==", "Rap")
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
            $(".albumContent").append(`
            <div class="album">
                <h1>${doc.data().albumName}</h1>
                <img src="${doc.data().albumPhoto}" alt="Album Image"> 
                <h3>${doc.data().artistName}</h3>
                <p>${doc.data().genre}</p>
            </div>
            `)
        });
      });
    })
    $(".all").click(function(e){
        $(".albumContent").html("");
        _db
    .collection("Albums")
    .get()
    .then(function(querySnapshot){
        querySnapshot.forEach(function(doc){
            $(".albumContent").append(`
            <div class="album">
                <h1>${doc.data().albumName}</h1>
                <img src="${doc.data().albumPhoto}" alt="Album Image"> 
                <h3>${doc.data().artistName}</h3>
                <p>${doc.data().genre}</p>
            </div>
            `)
        });
    }, function(error){
        console.log("Error:", error);
    })
    })
}
// first page load
function loadAlbums(doc){
    _db
    .collection("Albums")
    .get()
    .then(function(querySnapshot){
        querySnapshot.forEach(function(doc){
            $(".albumContent").append(`
            <div class="album">
                <h1>${doc.data().albumName}</h1>
                <img src="${doc.data().albumPhoto}" alt="Album Image"> 
                <h3>${doc.data().artistName}</h3>
                <p>${doc.data().genre}</p>
            </div>
            `)
        });
    }, function(error){
        console.log("Error:", error);
    })
}




$(document).ready(function(){
    try {
        let app = firebase.app();
        initFirebase();
        filterListen();
        loadAlbums();
      } catch {
        console.error("failed to load functions");
      }
})
