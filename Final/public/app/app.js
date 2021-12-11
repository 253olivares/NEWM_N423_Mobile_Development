$(document).ready(function () {
  try {
    let app = firebase.app();
    initFirebase();
  } catch (e) {
    console.error(e);
    alert(e);
  }
});
