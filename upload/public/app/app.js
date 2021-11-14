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

// function inirFirebase() {
//   firebase
//     .auth()
//     .signInAnonymously()
//     .then(() => {});
// }

$(document).ready(function () {
  try {
    // inirFirebase();
  } catch (e) {
    console.log(e);
  }
});
