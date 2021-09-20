var Students = [];

function initSite() {
    if(localStorage){
       let rememberName = JSON.parse(localStorage.getItem("Students"));
        if(rememberName.rememberMe){
          $("#fName").val(rememberName.fn);
          $("#lName").val(rememberName.ln);
          
        }else{

        }
        // console.log("I have it");
        // localStorage.setItem('Students', JSON.stringify({name: "Todd"}));
        // console.log(localStorage.getItem('Students')); 
    }else{
      
    }
}

function initListener(){

    $("#submit").click(function(e){
        e.preventDefault();
        let fn = $("#fName").val();
        let ln = $("#lName").val();
        let email = $("#email").val();
        let check =  $("#checkbox").prop("checked");
        console.log(fn + " " + ln);
        let stuObj = {"fn": fn, "ln": ln, "email": email, "rememberMe": check} ;

        localStorage.setItem('Students', JSON.stringify(stuObj));
    });
}

$(document).ready(function(){
    initSite();
    initListener();
});