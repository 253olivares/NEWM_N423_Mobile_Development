var _db;

function initFirebase(){
    // firebase
    // .auth()
    // .signInAnonymously()
    // .then(() => {
    //   // Signed in..
    // })
    // .catch((error) => {
    //   var errorCode = error.code;
    //   var errorMessage = error.message;
    //   _db = [];
    // });
  // associated _db with our firebase firestore 
  _db = firebase.firestore();
}

function initListener(){
    $("#formSubmit").click(function(e){
        let name = $("#fullName").val();
        let user = $("#username").val();
        let pass = $("#password").val();
        console.log("test");
        let obj = {name: name, username: user, password: pass};
        console.log(obj);

        console.log(_db);

        _db
        .collection("Midterm")
        .add(obj)
        .then(
            function(doc){
                console.log("added doc " + doc.id);
            }, function (error){
                console.log("error", error)
            }
        )
    });
    $("#data").click(function(e){
        $(".displayData").html("");
        _db
        .collection("Midterm")
        .get()
        .then(function(querySnapshot){
            querySnapshot.forEach(function(doc){
                $(".displayData").append(`
                <div>
                <h1>Name:${doc.data().name}</h1>
                <h1>Username:${doc.data().username}</h1>
                <h1>Name:${doc.data().password}</h1>
                </div>
                `)
            });
        }, function(error){
            console.log("Error:", error);
        })
    });
}

$(document).ready(function(){
    try{
        
        let app = firebase.app();
        initFirebase();
        initListener();
        console.log("Page loaded");
    } catch{
        console.error("Failed to load Functions");
    }
})