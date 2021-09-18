var error =`<div class="InfoBox1">
<h1 id="feedback">To begin please fill out Zipcode and how many days you want to view!</h1>
</div>`;

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
    $.getJSON(`https://api.weatherapi.com/v1/forecast.json?key=1e60b3a3baf345238d6202952211309&q=${zip}&days=${days}&aqi=no&alerts=no
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
        let region = data.location.region; 
        let location = data.location.name;
        let iconStatus = data.current.condition.icon;
        let description = data.current.condition.text;
        let temp_c = data.current.temp_c;
        let temp_f = data.current.temp_f;
        let humidity = data.current.humidity;
        let percip = data.current.precip_in;
        let percip_mm = data.current.precip_mm;
        let wind = data.current.wind_mph;
        let wind_kph = data.current.wind_kph;
        let uv = data.current.uv;

        var displayInfo = ` <div class="infoBox">
<div class="conditionName">
    <img src="${iconStatus}" height="120px" alt="Weather Condition">
    <div class="location">
        <h1 class="local">${region}, ${location}</h1>
        <hr class="under">
        <h3 class="desc">${description}</h3>
    </div>
</div>
<div class="tempature">
    <h2>C° ${temp_c} / F° ${temp_f}</h2>
</div>
<div class="moreInfo">
    <div class="humidity extras">
        <img src="img/Humidity.png" width="100px" height="100px"alt="">
        <br>
        <h3>${humidity}%</h3>
        <h2>Humidity</h2>
    </div>
    <div class="precip extras">
        <img src="img/Percipitation.png" width="100px" height="100px" alt="">
        <br>
        <h3>${percip_mm} mm</h3>
        <h3>${percip} in</h3>
        <h2>Percipitation</h2>
    </div>
    <div class="wind extras">
        <img src="img/Wind.png" width="100px" height="100px" alt="">
        <br>
        <h3>${wind} mph</h3>
        <h3>${wind_kph} kph</h3>
        <h2>Wind</h2>
    </div>
    <div class="uv extras">
        <img src="img/Uv.png" width="100px" height="100px" alt="">
        <br>
        <h3>${uv}</h3>
        <h2>UV</h2>
    </div>
</div>
</div>
`;
        $('.glass').html(displayInfo);


        

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