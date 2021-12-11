//Status Variable that will switch true and false based on what is set in the functions
var logStatus = false;
//Status variable that checkes for admin authorization
var authorizationAdmin = false;
//Initializes database
var bookid;
var _db;

//fucntion that checks for changes in the header
function checkHash() {
  $(window).on("hashchange", route);
  route();
}

function login() {
  let user = $("#logUser").val();
  let pass = $("#logPass").val();
}
function signout() {
  firebase
    .auth()
    .signOut()
    .then(() => {
      console.log("Signed Out");
    })
    .catch((error) => {
      console.log(error);
      // An error happened.
    });
}
function signUp() {
  let fName = $("#signfullName").val();
  let lName = $("#signlastName").val();
  let username = $("#signuserName").val();
  let email = $("#signemail").val();
  let password = $("#signpassword").val();
}

//function that runs after our hash that controls objects on our page after load
//and initializes our database
function afterRoute(page) {
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
      break;
    case "account":
      checkLogin();
      break;
    case "account":
      console.log("you are on the account page!");
      break;
    case "book":
      // loadSelectBook();
      break;
    case "newBook":
      break;
  }
}

function loadSelectBook() {
  $(".bookPage").html(`
  <div class="bookPage__holder">
  <div class="bookPage__holder__images">
      <img src="" alt="Communist Manifesto">
  </div>
  <div class="bookPage__holder__details"> 
      <h1></h1>
      <p>Author: </p>
      <p>ISBN: </p>
      <p>DOP: </p>
      <p>Number of Pages</p>
      <p>Description: </p>
      <p>QT: </p>
  </div>
</div>
<div class="buttons">
  <button onclick="editBook(0)">Edit Book</button>
  <button onclick="deleteBook(0)">Delete Book</button>
</div>
  `);
}

function loadBooks(doc) {
  $(".catalogList").empty();
  _db
    .collection("Books")
    .get()
    .then(
      function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          $(".catalogList").append(`
          <div class="bookList" onclick="loadPick(${doc.data()})">
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
          `);
        });
      },
      function (error) {
        console.log("Error:", error);
      }
    );
}

function loadPick(x) {
  MODEL.changeContent("book", afterRoute);
  book = x;
  console.log(x);
}

function editBook(x) {}

function deleteBook(x) {}

function checklogin() {
  if (logStatus == false) {
  } else {
  }
}

function checkAuth() {
  if (authorizationAdmin == false) {
    $(".addBook").css("display", "");
  } else {
    $(".addBook").css("display", "flex");
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
      $(".navElements").css("display", "none");
      $(".account").css("display", "block");
      $(".logout").css("display", "block");
      $(".home").css("display", "block");
      $(".catalog").css("display", "block");
      checkAuth();
      logStatus = true;
    } else {
      $(".navElements").css("display", "none");
      $(".lsnav").css("display", "block");
      $(".home").css("display", "block");
      $(".catalog").css("display", "block");
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
