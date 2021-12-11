//Status Variable that will switch true and false based on what is set in the functions
var logStatus = false;
var authorizationAdmin = false;
//Initializes database
var bookid;
//Database
var _db;

//fucntion that checks for changes in the header
function checkHash() {
  $(window).on("hashchange", route);
  route();
}

//Function to login
function login() {
  let user = $("#logUser").val();
  let pass = $("#logPass").val();
  _db
    .collection("USERS")
    .doc(user)
    .get()
    .then(
      function (doc) {
        firebase
          .auth()
          .signInWithEmailAndPassword(doc.data().email, pass)
          .then((userCredential) => {
            // Signed in
            $("#logUser").val("");
            $("#logPass").val("");
            logStatus = true;
            $(".sad").css("display", "");
          })
          .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorMessage);
            alert(errorCode + " " + errorMessage);
          });
      },
      function (error) {
        console.log("Error:", error);
      }
    );
}

//function to sign out
function signout() {
  firebase
    .auth()
    .signOut()
    .then(() => {
      console.log("Signed Out");
      logStatus = false;
      authorizationAdmin = false;
      MODEL.changeContent("home", afterRoute);
    })
    .catch((error) => {
      console.log(error);
      // An error happened.
    });
}

//function to sign up
function signUp() {
  let fName = $("#signfullName").val();
  let lName = $("#signlastName").val();
  let username = $("#signuserName").val();
  let email = $("#signemail").val();
  let password = $("#signpassword").val();
  let fullName = fName + " " + lName;
  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      $("#signfullName").val("");
      $("#signlastName").val("");
      $("#signuserName").val("");
      $("#signemail").val("");
      $("#signpassword").val("");
      _db
        .collection("USERS")
        .doc(username)
        .set({
          name: fullName,
          username: username,
          id: userCredential.user.uid,
          email: email,
          cred: "User",
        })
        .then(() => {
          console.log("Document successfully written!");
          logStatus = true;
        })
        .catch((error) => {
          console.error("Error writing document: ", error);
        });
      console.log(userCredential.user);
      $(".sad").css("display", "");
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorMessage);
      alert(errorCode + " " + errorMessage);
    });
}

//function that runs after our hash that controls objects on our page after load
//and initializes our database
function afterRoute(page) {
  //  initFirebase();
  // initLogin();
  // checkNav();
  switch (page) {
    case "home":
      console.log("You are on the home page!");
      loginModal();
      break;
    case "catalog":
      console.log("you are on the catalog page!");
      loginModal();
      loadBooks();
      checkAuth();
      break;
    case "account":
      checkLogin();
      break;
    case "account":
      console.log("you are on the account page!");
      break;
    case "book":
      loadSelectBook();
      break;
    case "newBook":
      break;
  }
}

//function to load selected book
function loadSelectBook() {
  if (bookid == null) {
    $(".bookPage").html(
      `<h1 class="nothing">No books were Selected please choose from catalog!</h1>`
    );
  } else {
    if (authorizationAdmin == false) {
      _db
        .collection("Books")
        .doc(`${bookid}`)
        .get()
        .then(
          function (doc) {
            $(".bookPage").html(`
          <div class="bookPage__holder">
          <div class="bookPage__holder__images">
              <img src="${doc.data().bookImage}" alt="Communist Manifesto">
          </div>
          <div class="bookPage__holder__details">
              <h1>${doc.data().name}</h1>
              <p>Author: ${doc.data().author}</p>
              <p>ISBN: ${doc.data().ISBN}</p>
              <p>DOP:  ${doc.data().dop}</p>
              <p>Number of Pages: ${doc.data().pages}</p>
              <p>Description: ${doc.data().description}</p>
              <p>QT: ${doc.data().qt}</p>
          </div>
        </div>
          `);
          },
          function (error) {
            console.log("Error:", error);
          }
        );
    } else {
      _db
        .collection("Books")
        .doc(`${bookid}`)
        .get()
        .then(
          function (doc) {
            $(".bookPage").html(`
          <div class="bookPage__holder">
          <div class="bookPage__holder__images">
              <img src="${doc.data().bookImage}" alt="Communist Manifesto">
          </div>
          <div class="bookPage__holder__details">
              <h1>${doc.data().name}</h1>
              <p>Author: ${doc.data().author}</p>
              <p>ISBN: ${doc.data().ISBN}</p>
              <p>DOP:  ${doc.data().dop}</p>
              <p>Number of Pages: ${doc.data().pages}</p>
              <p>Description: ${doc.data().description}</p>
              <p>QT: ${doc.data().qt}</p>
          </div>
        </div>
        <div id="authDis" class="buttonsPS">
          <button onclick="editBook(${doc.data().id})">Edit Book</button>
          <button onclick="deleteBook(${doc.data().id})">Delete Book</button>
        </div>
          `);
          },
          function (error) {
            console.log("Error:", error);
          }
        );
    }
  }
}

//function to load books
function loadBooks(doc) {
  bookid = "";
  $(".catalogList").empty();
  _db
    .collection("Books")
    .get()
    .then(
      function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          $(".catalogList").append(`
          <a href="#/book">
          <div class="bookList" onclick="loadPick(${doc.data().id})">
          <div class="bookList__image">
              <img src="${doc.data().bookImage}" alt="Book image">
          </div>
          <div class="bookList__name">
              <h1>${doc.data().name}</h1>
          </div>
          <div class="bookList__column">
              <p class="bookList__column__label">Column</p>
              <hr>
              <p class="bookList__column__dynamic">${doc.data().column}</p>
          </div>
          <d iv class="bookList__qt">
              <p>QT: <span>${doc.data().qt}</span></p>
          </d>
      </div>
      </a>
          `);
        });
      },
      function (error) {
        console.log("Error:", error);
      }
    );
}

//function to load picked book
function loadPick(x) {
  MODEL.changeContent("book", afterRoute);
  bookid = x;
}

// function to take to edit page that will edit the book
function editBook(x) {}

// function to delete book
function deleteBook(x) {}

// function to check login on account page to see if a user is loged in
function checkLogin() {
  switch (logStatus) {
    case true:
      $(".accountPage").html("<h1>User is logged in!</h1>");
      break;
    case false:
      $(".accountPage").html("<h1>No user is logged in!</h1>");
      break;
  }
}

function checkAuth() {
  switch (authorizationAdmin) {
    case true:
      $(".addBook").css("display", "flex");
      break;
    case false:
      $(".addBook").css("display", "");
      break;
  }
}

//function to make modal appear and dissappear
function loginModal() {
  $(".lsnav").click(function () {
    $(".sad").css("display", "flex");
    $("#app").css("overflow", "hidden");
    $(".closeHolder").click(function () {
      $(".sad").css("display", "");
      $("#app").css("overflow", "scroll");
    });
  });
}

//function that checks firebase to see if user is signed in and if they are change nav
function initFirebase() {
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      _db
        .collection("USERS")
        .where("email", "==", user.email)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
            switch (doc.data().cred) {
              case "Admin":
                authorizationAdmin = true;
                break;
            }
            checkAuth();
          });
        })
        .catch((error) => {
          console.log("Error getting documents: ", error);
        });
      $(".navElements").css("display", "none");
      $(".account").css("display", "block");
      $(".logout").css("display", "block");
      $(".home").css("display", "block");
      $(".catalog").css("display", "block");
      logStatus = true;
    } else {
      $(".navElements").css("display", "none");
      $(".lsnav").css("display", "block");
      $(".home").css("display", "block");
      $(".catalog").css("display", "block");
      checkAuth();
      logStatus = false;
    }
  });
  _db = firebase.firestore();
}

//function that replaces the hash in the header
function route() {
  let hashTag = window.location.hash;
  let pageID = hashTag.replace("#/", "");

  switch (pageID) {
    case "home":
      MODEL.changeContent(pageID, afterRoute);
      break;
    case "catalog":
      MODEL.changeContent(pageID, afterRoute);
      break;
    case "account":
      MODEL.changeContent(pageID, afterRoute);
      break;
    case "book":
      MODEL.changeContent(pageID, afterRoute);
      break;
    default:
      MODEL.changeContent("home", afterRoute);
      console.log("URL is invalid or empty");
      break;
  }
}

//function that runs at the start of the page and loads all functions
$(document).ready(function () {
  try {
    checkHash();
    let app = firebase.app();
    initFirebase();
    console.log(
      "If you see this console log then that means that the check hash function has finished running. And the page has successfully collected our JSON data."
    );
  } catch (e) {
    console.error(e);
    alert(e);
  }
});
