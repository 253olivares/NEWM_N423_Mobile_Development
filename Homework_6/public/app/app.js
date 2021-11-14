var _db;
var g = "";

function displayModal(){
  $(".modal").css("display","flex");
}

function removeModal(){
  $(".modal").css("display","none");

}


function loadAlbums(doc){
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
}

function loadSelectAlbums(music) {
  $(".albumContent").html("");
  if(music == "hiphop"){
    music = "Hip Hop";
  } else if (music == "rap"){
    music = "Rap";
  } else if (music == "indie"){
    music = "Indie";
  }
  _db
  .collection("Albums")
  .where("genre", "==", music)
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
}


function initFirebase() {
  firebase
  .auth()
  .onAuthStateChanged((user) => {
    if(user){
      let displayName = user.displayName;
      let email = user.email;
      let emailVerified = user.emailVerified;
      let isAnonymous = user.isAnonymous; 
      let genre = user.photoURL;
      if(user.photoURL == null){
        console.log("g " + g);
        genre = g;
      }
      
      let uid = user.uid; 
      console.log(genre);
      console.log(uid);
      // old idea of creating a seperate genre database that stores user genre since we cant keep custom values in the authentiation
      // let genre = retrieveUserGenre(uid);
      // var music = user.music;
      if (genre == "hiphop" || "rap" || "indie"){

        console.log("user has been logged in");
        $(".hide").css("display","none");
        $(".logout").css("display","block");
        $(`.${genre}`).css("display","block");
        //this function loads all selctive albums based on user set genre;
        loadSelectAlbums(genre);

      } else {
        $(".hide").css("display","none");
        $(".hiphop").css("display","block");
        $(".rap").css("display","block");
        $(".indie").css("display","block");
        $(".all").css("display","block");
        $(".logout").css("display","block");
        //this loads all the albums w hen no user is signed in
        console.log("Google User Logged in so display all!");
        loadAlbums();
      }
    }else {
      $(".hide").css("display","none");
      $(".hiphop").css("display","block");
      $(".rap").css("display","block");
      $(".indie").css("display","block");
      $(".all").css("display","block");
      $(".login").css("display","block");
      //this loads all the albums w hen no user is signed in
      console.log("logged out");
      loadAlbums();
      g = "";
    };
  });
  _db = firebase.firestore();
    // firebase
    //   .auth()
    //   .signInAnonymously()
    //   .then(() => {
    //     // signing in anonymously
    //   })
    //   .catch((error) => {
    //     var errorCode = error.code;
    //     var errorMessage = error.message;
    //     _db = [];
    //   });  
    // _db = firebase.firestore();
  };


function updateUser(disName, genre){
  firebase
  .auth()
  .currentUser
  .updateProfile({
    displayName:disName,
    photoURL:genre,
  });
}
// function storeGenre(id,genre){
//   _db.collection("hw6Users").doc(id).set({
//     uid: id,
//     genre: genre
//   })
//   .then(()=>{
//     console.log("New Document Information Written");
//   })
//   .catch((error) => {
//     console.error("Error Writing Document: ", error);
//   })
// }
//attempt to fix me create issuse didnt work
function secondLogin(email, password) {
  firebase.auth().signInWithEmailAndPassword(email, password)
 .then((userCredential) => {
   // Signed in
   var user = userCredential.user;
 })
 .catch((error) => {
   var errorCode = error.code;
   var errorMessage = error.message;
   console.log(errorMessage)
   alert(errorCode + " " +errorMessage);
 });
}

function createUser(){
  let fName = $("#fName").val();
  let lName = $("#lName").val();
  let email = $("#emailCreate").val();
  let password = $("#passwordCreate").val();
  let genre = $("#genre").val();
  g = genre;
  console.log(fName);
  console.log(lName);
  console.log(email);
  console.log(password);
  console.log(genre);
  firebase.auth().createUserWithEmailAndPassword(email, password)
.then((userCredential) => {
  let fullName  = fName + ' '+lName;
  var user = userCredential.user;
 
  updateUser(fullName,genre);

  // firebase
  // .auth()
  // .currentUser
  // .updateProfile({
  //   displayName:fullName,
  //   photoURL:genre,
  // });

  // Signed in 
  $("#fName").val("");
  $("#lName").val("");
  $("#emailCreate").val("");
  $("#passwordCreate").val("");

  // console.log(userCredential.user);
  // console.log(user)
  // storeGenre(user.uid, genre);
  // console.log(user.uid);
  // console.log(genre);

  // signout();
  // secondLogin(email, password);
  removeModal();
  // initFirebase();
  // ...
})
.catch((error) => {
  var errorCode = error.code;
  var errorMessage = error.message;
  console.log(errorMessage)
  alert(errorCode + " " +errorMessage);
  // ..
});
}

function login() {
  let email = $("#liemail").val();
    let password = $("#lipassword").val();
  console.log(email);
  console.log(password);
   firebase.auth().signInWithEmailAndPassword(email, password)
 .then((userCredential) => {
   // Signed in
   let email = $("#liemail").val("");
   let password = $("#lipassword").val("");
   var user = userCredential.user;
   removeModal()
   // ...
 })
 .catch((error) => {
   var errorCode = error.code;
   var errorMessage = error.message;
   console.log(errorMessage)
   alert(errorCode + " " +errorMessage);
 });
}

function signout() {
  firebase.auth().signOut().then(() => {
    console.log("Signed Out");
  }).catch((error) => {
      console.log(error);
    // An error happened.
  });
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

// function retrieveUserGenre(uid){
//   _db.collection("hw6Users").doc(uid).get().then((doc)=>{
//     if (doc) {
//       console.log("Document data:", doc.data().genre);
//   } else {
//       // doc.data() will be undefined in this case
//       console.log("No such document!");
//   }
//   }).catch((error) => {
//     console.log("Error getting document:", error);
// });
// }


//google sign inz
// var provider = new firebase.auth.GoogleAuthProvider();
// firebase.auth()
//   .signInWithPopup(provider)
//   .then((result) => {
//     /** @type {firebase.auth.OAuthCredential} */
//     var credential = result.credential;

//     // This gives you a Google Access Token. You can use it to access the Google API.
//     var token = credential.accessToken;
//     // The signed-in user info.
//     var user = result.user;
//     // ...
//   }).catch((error) => {
//     // Handle Errors here.
//     var errorCode = error.code;
//     var errorMessage = error.message;
//     // The email of the user's account used.
//     var email = error.email;
//     // The firebase.auth.AuthCredential type that was used.
//     var credential = error.credential;
//     // ...
//   });


function signInGoogle() {
  var provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth()
  .signInWithPopup(provider)
  .then((result) => {
    /** @type {firebase.auth.OAuthCredential} */
    var credential = result.credential;

    // This gives you a Google Access Token. You can use it to access the Google API.
    var token = credential.accessToken;
    // The signed-in user info.
    var user = result.user;
    removeModal();
    // ...
  }).catch((error) => {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;
    // ...
  });

}

$(document).ready(function(){
    try {
        let app = firebase.app();
        initFirebase();
        filterListen();
      } catch {
        console.error("failed to load functions");
      }
})
