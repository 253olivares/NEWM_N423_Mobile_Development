var _db;

function initFirebase(){
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

function initListeners(){
    $(".submitBtn").click(function(e){
        let fn = $("#fName").val();
        let fnObj = {"fName": fn}
        _db
        .collection("Names")
        .add(fnObj)
        .then(function(doc){
            console.log("added doc " + doc.id);
            $("#fName").val("");
        },
        function(error){
            console.log("error", error);
        });
    });

    $(".getBtn").click(function(e){
        _db
        .collection("Names")
        .get()
        .then(function(querySnapshot){
            querySnapshot.forEach(function (doc){
                console.log(doc.data());
            });
        });
    });
}


$(document).ready(function(){
    try{
        let app = firebase.app();
        initFirebase();
        initListeners();
    } catch {
        console.error(e);
    }
});