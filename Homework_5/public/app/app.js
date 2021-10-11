import * as Model from "../model/model.js";

function initListeners() {

}


$(document).ready(function () {
    Model.initFirebase();
    Model.signIn(initListeners);
});