//Status Variable that will switch true and false based on what is set in the functions
var logStatus = false;
var currentUser;
var userInfo;
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
          password: password,
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
    case "book":
      loadSelectBook();
      break;
    case "add":
      break;
    case "edit":
      editBook();
      break;
    case "editaccount":
      editAccount();
      break;
  }
}

function editAccount() {
  if (currentUser == null) {
    $(".editAccountPage").html(
      "<br> <br> <br> <br> <h1>User must be logged into edit information!</h1>"
    );
  } else {
    _db
      .collection("USERS")
      .doc(`${userInfo}`)
      .get()
      .then(
        function (doc) {
          $(".acced").html(`
          <div class="acced__desc">
            <div  class="acced__desc__img">
                <label for="aImage">Account Image: </label>
                <input type="file" id="aImage" name="aImage">
            </div>
            <div class="acced__desc__name">
                <label for="accName">Account Username: </label>
                <input type="text" id="accName" value="${
                  doc.data().username
                }" name="accName">
            </div>      
            <div class="acced__desc__email">
                <label for="accEmail">Email: </label>
                <input type="text" id="accEmail" value="${
                  doc.data().email
                }" name="accEmail"  disabled>
            </div>
            <div class="acced__desc__fn">
                <label for="accFN">Full Name: </label>
                <input type="text" id="accFN" value="${
                  doc.data().name
                }" name="accFN">
            </div>
            <div class="acced__desc__access">
                <label for="accAccess">Access: </label>
                <input type="text" id="accAccess" value="${
                  doc.data().cred
                }" name="accAccess"  disabled>
            </div>
        </div>
          `);
        },
        function (error) {
          console.log("Error:", error);
        }
      );
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
            console.log(doc.data());
            $(".bookPage").html(`
          <div class="bookPage__holder">
          <div class="bookPage__holder__images">
              <img src="${doc.data().bookImage}" alt="Book image">
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
            console.log(doc.data());
            $(".bookPage").html(`
          <div class="bookPage__holder">
          <div class="bookPage__holder__images">
            <img src="${doc.data().bookImage}" alt="Book image">
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
          <a href="#/edit"><button>Edit Book</button></a>
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
//function that grabs information from add page and pushes it to the database
function saveBook() {
  let bookImage = $("#bImage").prop("files")[0];
  let setID = 0;
  _db
    .collection("Books")
    .get()
    .then(function (data) {
      setID = data.size + 1;
    });

  if (bookImage !== null) {
    let storageRef = firebase.storage().ref();
    let imageFile = $("#bImage").prop("files")[0];
    let image = storageRef.child(imageFile.name);
    const metadata = { contentType: imageFile.type };
    let date = Date.parse(new Date());
    let genreB = $("#genreB").val();
    let bName = $("#bName").val();
    let author = $("#author").val();
    let isbn = $("#isbn").val();
    let column = $("#column").val();
    let dop = $("#dop").val();
    let nPage = $("#nPage").val();
    let desc = $("#desc").val();
    let qt = $("#qt").val();
    _db = firebase.firestore();
    const task = storageRef
      .child("images/" + date + imageFile.name)
      .put(imageFile, metadata);
    task
      .then((snapshot) => snapshot.ref.getDownloadURL())
      .then((url) => {
        let userObj = {
          ISBN: isbn,
          author: author,
          bookImage: url,
          column: column,
          description: desc,
          dop: dop,
          genre: genreB,
          id: setID,
          name: bName,
          pages: nPage,
          qt: qt,
        };
        _db
          .collection("Books")
          .doc(`${setID}`)
          .set(userObj)
          .then(function (doc) {
            console.log("book has been added");
            alert("Book has been sucesfully added!");
            window.location.hash = "#/catalog";
          });
      })
      .catch((error) => {});
  }
}

// function to take to edit page that will edit the book
function editBook() {
  if (bookid == null) {
    $(".editPage").html(
      `<br> <br> <br> <br> <br> <h1 class="emptyHed">No book is selected!</h1>`
    );
  } else {
    if (authorizationAdmin == false) {
      $(".editPage").html(
        `<br> <br> <br> <br> <br> <h1 class="emptyHed">Please be logged in as a adminstrator to edit this page!</h1>`
      );
    } else {
      _db
        .collection("Books")
        .doc(`${bookid}`)
        .get()
        .then(function (doc) {
          $(".formeditBook").html(`<h1>Update Book</h1>
          <label for="bImageB">Book Image: </label>
          <input type="file" id="bImageB" name="bImage">
          <label for="bNameB">Book Name: </label>
          <input type="text" id="bNameB" value="${
            doc.data().name
          }" name="bName">
          <label for="genreB">Select a Genre: </label>
                  <select name="genre" id="genreBE" >
                      <option value="Action">Action</option>
                      <option value="Adventure">Adventure</option>
                      <option value="Classics">Classics</option>
                      <option value="history">History</option>
                      <option value="Comic">Comic book or Graphic Novel</option>
                      <option value="Fantasy">Fantasy</option>
                      <option value="Philosophy">Philosophy</option>
                  </select>
          <label for="authorB">Author: </label>
          <input type="text" id="authorB" value="${
            doc.data().author
          }"  name="author">
          <label for="isbnB">ISBN: </label>
          <input type="text" id="isbnB" value="${doc.data().ISBN}" name="isbn">
          <label for="columnB">Column: </label>
          <input type="text" id="columnB" value="${
            doc.data().column
          }"  name="column">
          <label for="dopB">DOP: </label>
          <input type="text" id="dopB"  value="${doc.data().dop}" name="dop">
          <label for="nPageB">Number of Pages: </label>
          <input type="text" id="nPageB"value="${
            doc.data().pages
          }"  name="nPage">
          <label for="descB">Description: </label>
          <textarea type="textarea" style="resize: none;" id="descB" rows="8" name="desc">${
            doc.data().description
          }</textarea>
          <label for="qtB">QT: </label>
          <input type="text" id="qtB" value="${doc.data().qt}"  name="qt">
          <button title="saveBooks" onclick="saveChanges(${
            doc.data().id
          })" class="sbook">Save Changes</button>`);
          document.getElementById("genreBE").value = doc.data().genre;
        });
    }
  }
}

function saveChanges(x) {
  let bookImage = $("#bImageB").prop("files");
  console.log(bookImage);
  if (bookImage.length !== 0) {
    let storageRef = firebase.storage().ref();
    let imageFile = $("#bImageB").prop("files")[0];
    let image = storageRef.child(imageFile.name);
    const metadata = { contentType: imageFile.type };
    let date = Date.parse(new Date());
    let genreB = $("#genreBE").val();
    let bName = $("#bNameB").val();
    let author = $("#authorB").val();
    let isbn = $("#isbnB").val();
    let column = $("#columnB").val();
    let dop = $("#dopB").val();
    let nPage = $("#nPageB").val();
    let desc = $("#descB").val();
    let qt = $("#qtB").val();
    _db = firebase.firestore();
    const task = storageRef
      .child("images/" + date + imageFile.name)
      .put(imageFile, metadata);
    task
      .then((snapshot) => snapshot.ref.getDownloadURL())
      .then((url) => {
        imgFile = url;
        _db.collection("Books").doc(`${x}`).update({
          ISBN: isbn,
          author: author,
          bookImage: imgFile,
          column: column,
          description: desc,
          dop: dop,
          genre: genreB,
          name: bName,
          pages: nPage,
          qt: qt,
        });
      })
      .catch((error) => {});
  } else {
    let genreB = $("#genreBE").val();
    let bName = $("#bNameB").val();
    let author = $("#authorB").val();
    let isbn = $("#isbnB").val();
    let column = $("#columnB").val();
    let dop = $("#dopB").val();
    let nPage = $("#nPageB").val();
    let desc = $("#descB").val();
    let qt = $("#qtB").val();
    console.log(bName);
    _db.collection("Books").doc(`${x}`).update({
      name: bName,
      ISBN: isbn,
      author: author,
      description: desc,
      dop: dop,
      column: column,
      genre: genreB,
      pages: nPage,
      qt: qt,
    });
  }

  alert("Book has been sucesfully updated!");
  window.location.hash = "#/catalog";
}

function saveUserChanges() {
  let userImage = $("#aImage").prop("files");
  if (userImage.length !== 0) {
    let storageRef = firebase.storage().ref();
    let imageFile = $("#aImage").prop("files")[0];
    let image = storageRef.child(imageFile.name);
    const metadata = { contentType: imageFile.type };
    let date = Date.parse(new Date());
    let acName = $("#accName").val();
    let acFN = $("#accFN").val();
    _db = firebase.firestore();
    const task = storageRef
      .child("images/" + date + imageFile.name)
      .put(imageFile, metadata);
    task
      .then((snapshot) => snapshot.ref.getDownloadURL())
      .then((url) => {
        imgFile = url;
        _db.collection("USERS").doc(`${userInfo}`).update({
          images: imgFile,
          name: acFN,
          username: acName,
        });
      })
      .catch((error) => {});
  } else {
    let acName = $("#accName").val();
    let acFN = $("#accFN").val();
    _db.collection("USERS").doc(`${userInfo}`).update({
      name: acFN,
      username: acName,
    });
  }
  alert("Account has been sucesfully updated!");
  window.location.hash = "#/account";
}

// function to delete book
function deleteBook(x) {
  console.log(x);
  _db
    .collection("Books")
    .doc(`${x}`)
    .delete()
    .then(() => {
      console.log("Document successfully deleted!");
      alert("Book has been sucesfully deleted!");
      window.location.hash = "#/catalog";
    })
    .catch((error) => {
      console.error("Error removing document: ", error);
    });
}

function SearchQuere() {
  let searchName = $("#SearchBar").val();
  let searchGenre = $("#genreS").val();
  if (searchName !== "") {
    if (searchGenre == "") {
      $(".catalogList").empty();
      _db
        .collection("Books")
        .where("name", "==", searchName)
        .get()
        .then(function (querySnapshot) {
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
        });
      alert("Query search finished");
    } else {
      $(".catalogList").empty();
      _db
        .collection("Books")
        .where("name", "==", searchName)
        .where("genre", "==", searchGenre)
        .get()
        .then(function (querySnapshot) {
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
        });
      alert("Query search finished");
    }
  } else {
    if (searchGenre == "") {
      alert("No search queries requested!");
      window.location.hash = "#/catalog";
    } else {
      $(".catalogList").empty();
      _db
        .collection("Books")
        .where("genre", "==", searchGenre)
        .get()
        .then(function (querySnapshot) {
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
        });
      alert("Query search finished");
    }
  }
}

// function to check login on account page to see if a user is loged in
function checkLogin() {
  console.log(userInfo);
  switch (logStatus) {
    case true:
      _db
        .collection("USERS")
        .doc(`${userInfo}`)
        .get()
        .then(function (doc) {
          $(".acc").html(`
          <div class="acc__images">
          <img src="${doc.data().images}" alt="accountImage">
      </div>
      <div class="acc__desc">
          <div class="acc__desc__name">
              <p>Account Name: ${doc.data().username}</p>
          </div>      
          <div class="acc__desc__email">
              <p>Email: ${doc.data().email}</p>
          </div>
          <div class="acc__desc__fn">
              <p>Full Name: ${doc.data().name}</p>
          </div>
          <div class="acc__desc__access">
              <p>Access: ${doc.data().cred}</p>
          </div>
      </div>`);
        });
      break;
    case false:
      $(".accountPage").html(
        "<br> <br> <br> <br> <br><h1>No user is logged in!</h1>"
      );
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
                $(".addBook").css("display", "flex");
                break;
            }
            logStatus = true;
            currentUser = doc.data().cred;
            userInfo = doc.data().username;
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
    } else {
      $(".addBook").css("display", "");
      $(".navElements").css("display", "none");
      $(".lsnav").css("display", "block");
      $(".home").css("display", "block");
      $(".catalog").css("display", "block");
      checkAuth();
      currentUser = "";
      userInfo = "";
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
    case "add":
      MODEL.changeContent(pageID, afterRoute);
      break;
    case "edit":
      MODEL.changeContent(pageID, afterRoute);
      break;
    case "editaccount":
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
