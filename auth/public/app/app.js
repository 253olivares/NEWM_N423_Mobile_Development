function initListeners(){
    firebase.auth().onAuthStateChanged((user)=> {
        if (user){

            var displayName = user.displayName;
            var email = user.email;
            var emailVerified = user.emailVerified; 
            var photoURL = user.photoURL; 
            var isAnonymous = user.isAnonymous; 
            var uid = user.uid; 
            var providerData = user.providerData;
            var phoneNumber = user.phoneNumber;
            console.log("phoneNumber " + phoneNumber);
        } else {
            console.log("logged out");
        };
    });
};

function signOut(){
    firebase.auth().signOut().then(() => {
        // Sign-out successful.
      }).catch((error) => {
        // An error happened.
      });
}
function signInGoogle(){
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
function login(){
    let email = $("#liemail").val();
    let password = $("#lipw").val();
    firebase.auth().signInWithEmailAndPassword(email, password)
  .then((userCredential) => {
    // Signed in
    console.log("login")
    var user = userCredential.user;
    $("#liemail").val("");
    $("#lipw").val("");
    // ...
  })
  .catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
  });
}
function updateUser(disName, number){
    firebase
    .auth()
    .currentUser
    .updateProfile({
        displayName:disName,
    });
    firebase
    .auth()
    .currentUser
    .updatePhoneNumber({
        phoneNumber: number,
    });
}

function create(){
    let fName = $("#fName").val();
    let lName = $("#lName").val();
    let email = $("#email").val();
    let password = $("#pw").val();
    
    firebase.auth().createUserWithEmailAndPassword(email, password)
  .then((userCredential) => {
      let fullName = fName + ' '+ lName;
      updateUser(fullName, "317-867-5309");

    $("#fName").val("");
    $("#lName").val("");
    $("#email").val("");
    $("#pw").val("");
    // Signed in 
    var user = userCredential.user;
    // ...
    console.log("account created");
  })
  .catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log(errorMessage);
    // ..
  });
}
$(document).ready(function (){
    try {
        let app = firebase.app();
        initListeners();
    } catch {
        console.log("error on the try");
    }
});