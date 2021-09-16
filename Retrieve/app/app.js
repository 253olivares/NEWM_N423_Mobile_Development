function getData(){
    $.getJSON("../data/data.json", function(data){
        console.log(data);
        $.each(data.Students, function(idx, student){
            $('#content').append(`<div>
            <p>Name: ${student.studentName}</p>
            <p>GPA: ${student.studentGPA}</p>
            <p>${ student.studentAddress.streetNumber} <br/>
            ${ student.studentAddress.city}
            ${ student.studentAddress.state}
            ${ student.studentAddress.zipcode} 
            </p>
            
            </div>`);
            console.log(student.studentName);
            console.log(student.studentGPA);
            console.log(student.studentAddress.streetNumber);
            console.log(student.studentAddress.city);
            console.log(student.studentAddress.state);
            console.log(student.studentAddress.zipcode);
        });
        console.log(data.Students[0].studentName);
    }).done(function (e){
        console.log("hello",e);
    });
};
function eventForm(){
    $("#submission").click(function(e){
        console.log("test")
        e.preventDefault();
        let zipcode = document.getElementById("zipCode").value;
       getWeather(zipcode);
    });
}
function getWeather(zip){
    $.getJSON(`http://api.weatherapi.com/v1/current.json?key=1e60b3a3baf345238d6202952211309&q=${zip}&aqi=no`,function(data){
        console.log(data.current);
        $("#content").append(`<img src="${data.current.condition.icon}" />`);
    }
    ).fail(function(e){
        console.log(e)
    });
}

$(document).ready(function(){
    //getData();
    eventForm();
});