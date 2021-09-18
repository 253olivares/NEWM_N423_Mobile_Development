var error =`<div class="InfoBox1">
<h1 id="feedback">To begin please fill out Zipcode and how many days you want to view!</h1>
</div>`;
var displayInfo = ``;

// This function runs a command that grabs our form data our form data will contain the zipcode data that we will use to change our weather api search paremeters and get specfic data.
function eventForm(){
    $("#submission").click(function(e){
        console.log("test");
        e.preventDefault();
        let zipcode = $( "#zipcode" ).val();
        let days = $( "#daysSelection" ).val();
        // this trims the input and checks to make sure we dont submit empty spaces that will give us errors
        let filteredZip = $.trim(zipcode) 
        if(/^[a-zA-Z0-9- ]*$/.test( filteredZip) == false) {
            $(".glass").html(error);
            $("#feedback").html("Input box has invalid characters. Please try again!");
        }else{
            if(!filteredZip){
                console.log("Please Fill request");
                $(".glass").html(error);
                $("#feedback").html("Zipcode input has been left blank. Please fill in to begin using! ");
            } else {
                getWeather(zipcode,days);
            }
        }
    });
}

// here this function grabs our zip data and plus it into our API search paremeters. Here this API will grab information based on our information inserted.
function getWeather(zip, days){
    $.getJSON(`http://api.weatherapi.com/v1/forecast.json?key=1e60b3a3baf345238d6202952211309&q=${zip}&days=${days}&aqi=no&alerts=no
    `,function(data){
        console.log(data.current);
        console.log(data.location.region);
        console.log(data.location.name);
        console.log(data.current.wind_mph);
        console.log(data.current.precip_in);
        console.log(data.current.humidity);
        console.log(data.current.uv);
        console.log(data.current.temp_c);
        console.log(data.current.temp_f);
        console.log(data.current.condition.text);
        console.log(data.current.condition.icon); 
    }).fail(function(e){
        console.log(e);
        $(".glass").html(error);
        $("#feedback").html("API failed to collected information. Please make sure input information is correct.");
        console.log("Request Failed");
    });
}

$(document).ready(function(){
    // this here function is set to run at teh start of our page when its loadded. Here we can place any function or string of code we want to operate at the start.
    eventForm();
});