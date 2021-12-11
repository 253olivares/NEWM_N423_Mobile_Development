var imageURL = "";
var _db = "";

function CreateAccount() {
  let imageFile = $("#file").prop("files")[0];

  if (imageFile !== null) {
    let storageRef = firebase.storage().ref();
    let imageFile = $("#file").prop("files")[0];
    let image = storageRef.child(imageFile.name);
    const metadata = { contentType: imageFile.type };
    let date = Date.parse(new Date());
    let fn = $("#fName").val();
    let ln = $("#lName").val();
    let email = $("#email").val();
    let pw = $("#password").val();

    firebase
      .auth()
      .createUserWithEmailAndPassword(email, pw)
      .then((userCredential) => {
        var user = userCredential.user;
        let userID = user.id;
        _db = firebase.firestore();
        const task = storageRef
          .child("images/" + date + imageFile.name)
          .put(imageFile, metadata);
        task
          .then((snapshot) => snapshot.ref.getDownloadURL())
          .then((url) => {
            let userObj = {
              firstName: fn,
              lastName: ln,
              email: email,
              userImageName: date + imageFile.name,
              userImageURL: url,
            };
            console.log(url);
            _db
              .collection("USERS")
              .doc(user.uid)
              .set(userObj)
              .then(function (doc) {
                console.log("User id", user.uid);
              });
          })
          .catch((error) => {});
      });
    console.log("upload ", imageFile);
  } else {
    alert("You need to add an image!");
  }
}

function deleteImage() {
  //   var desertRef = storageRef.child(imageURL);
  let storageRef = firebase.storage().ref();
  let desertRef = storageRef.child("images/" + imageURL);
  desertRef
    .delete()
    .then(() => {
      console.log("deleted");
    })
    .catch((error) => {
      console.log("NOPE");
    });
}

function upload() {
  const task = storageRef
    .child("images/" + date + imageFile.name)
    .put(imageFile, metadata);
  task
    .then((snapshot) => snapshot.ref.getDownloadURL())
    .then((url) => {
      console.log(url);
      imageURL = date + imageFile.name;
      $("#fbImage").attr("src", url);
    });

  console.log("upload", imageFile);
}

function signout() {
  firebase
    .auth()
    .signOut()
    .then(() => {
      console.log("Signed Out");
      $(".diplayEdit").empty();
    })
    .catch((error) => {
      console.log(error);
      alert(error);
      // An error happened.
    });
}

function login() {
  let email = $("#lemail").val();
  let password = $("#lpassword").val();

  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Signed in
      _db = firebase.firestore();
      var user = userCredential.user;
      let userID = user.uid;
      var docRef = _db.collection("USERS").doc(userID);

      docRef.get().then((doc) => {
        if (doc.exists) {
          console.log("Document data:", doc.data());
          let userProfile = doc.data();
          $(".diplayEdit").append(
            `<input type="text" id="firstName" placeholder="${userProfile.firstName}" />
            <input type="text" id="lastName" placeholder="${userProfile.lastName}" />
            <input disabled type="text" id="pemail" placeholder="${userProfile.email}" />
            <div class="profileImg"><img id="pImg" src="${userProfile.userImageURL}"/> </div>
            <button onclick="edit('${userID}')">Save</button>
            `
          );
        } else {
          console.log("No such document!");
        }
      });
      $("#lemail").val("");
      $("#lpassword").val("");
      console.log("user has logged in");
      console.log(user.uid);
      // ...
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorMessage);
      alert(errorCode + " " + errorMessage);
    });
}

// function inirFirebase() {
//   firebase
//     .auth()
//     .signInAnonymously()
//     .then(() => {});
// }
function edit(userID) {
  let fn = $("#firstName").val();
  let ln = $("#lastName").val();
  let profileObj = {
    firstName: fn,
    lastName: ln,
  };
  var docRef = _db.collection("USERS").doc(userID);

  docRef
    .update(profileObj)
    .then(function () {
      console.log("data has been updated");
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorMessage);
      alert(errorCode + " " + errorMessage);
    });
}
$(document).ready(function () {
  try {
    // inirFirebase();
  } catch (e) {
    console.log(e);
  }
});
