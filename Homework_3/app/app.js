var Students = [];
function initSite(){
    if(localStorage){

    }else{

    }
}

function initListener(){
    $("#submit").click(function(e){
        e.preventDefault();
        let name = test;
        let age = test;
        let phone = test;
        let email = test;
        let classes = test;

        Obj = {"Name": name, "Age": age, "Phone": phone, "Email": email ,"Classes": classes };
        Students.push(Obj);
        localStorage.setItem(`Studednt`, JSON.stringify(Obj));
    });
}

$(document).ready(function(){
    initSite();
    initListener();
});