var _db;

export function initFirebase() {
    firebase.auth().onAuthStateChanged((user) => {
        if(user){
            console.log("There is a user");
        } else {
            console.log("No  User")
            _db="";
        }

        callback();
    });
}

export function signIn(){
    firebase
    .auth()
    .signInAnonymously()
    .then(function (result) {
        _db = firebase.firestore();
    });
}