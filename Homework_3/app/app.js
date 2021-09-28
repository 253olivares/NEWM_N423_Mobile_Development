var Students = [];
function initSite(){
    if(localStorage){
        console.log("You have information currently in your LocalStorage!");
        console.log("Information previously in localStorage:");
        console.log(localStorage);
        // localStorage.clear();
        console.log("Local storage cleared.");
    }
}

function initListener(){
    $("#submit").click(function(e){
        console.log("Running the Submit form fuction!");
        e.preventDefault();
        let fullName = $("#fName").val() + " " +  $("#lName").val();
        let name = fullName;
        let age = $("#age").val();
        let phone = $("#phoneNum").val();
        let email = $("#email").val();
        let classes = $("#classes").val();
        let classArr = [];
            console.log("information succesfully retrieved!")
            classArr = classes.split(" ").join("").split(",");
            console.log(classArr);
            Obj = {"Name": name, "Age": age, "Phone": phone, "Email": email ,"Classes": classArr };
            console.log("Data succesfully pushed into Obj Array");
            Students.push(Obj);
            localStorage.setItem(`Studednts`, JSON.stringify(Students));
            console.log("Data Succesfully written to the local storage!")
            console.log("Value Age is not numeric or contains non numeric values.");
    });
    $("#displayButton").click(function(e){
        console.log("Running the display local storage data function!");
        $(".one").html(" ");
        $(".two").html(" ");
        e.preventDefault();
        let data = JSON.parse(localStorage.getItem("Studednts"));
        console.log(data);
        let num = 0;
        $(data).each(function(){
            var displayInformation= `<div class="card">
            <h2>${data[num].Name}</h2>
            <div>
                <h4>Age:</h4> <p>${data[num].Age}</p>
            </div>
            <div>
                <h4>Phone:</h4> <p>${data[num].Phone}</p>
            </div>
            <div>
                <h4>Email:</h4>
                <p>${data[num].Email}</p>
            </div>
            <div>
                <h4>Classes:</h4>
                <div class="cardClasses${num} listingC">
                    
                </div>
            </div>
        </div>`;
        if (num % 2 == 0){
            $(".one").append(displayInformation);
        }else{
            $(".two").append(displayInformation);
        }
            let cardNum = 0;
            $(data[num].Classes).each(function(){
                var displayClassInfo =`<p>${data[num].Classes[cardNum]}</p>`;
                $(`.cardClasses${num}`).append(displayClassInfo);
                cardNum ++;
            });
            num++;
        });
    });
}

$(document).ready(function(){
    initSite();
    initListener();
});