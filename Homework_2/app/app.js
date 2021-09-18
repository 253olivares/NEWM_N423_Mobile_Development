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
        // this long strip of code grabs data from our api json string and attaches variables to them that is then put into the div and dynamically updates the information based on what area the user is requestings
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
        let wind_dir = data.current.wind_dir;
        let wind = data.current.wind_mph;
        let wind_kph = data.current.wind_kph;
        let uv = data.current.uv;
        let feelsC = data.current.feelslike_c;
        let feelsF = data.current.feelslike_f;

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
    <h2>C° ${temp_c} / F° ${temp_f}</h2> <h2>Feels Like: C° ${feelsC} / F° ${feelsF}</h2> 
</div>
<div class="moreInfo">
    <div class="humidity extras">
        <img src="img/Humidity.png" width="80px" height="80px"alt="">
        <br>
        <h3>${humidity}%</h3>
        <h2>Humidity</h2>
    </div>
    <div class="precip extras">
        <img src="img/Percipitation.png" width="80px" height="80px" alt="">
        <br>
        <h3>${percip_mm} mm</h3>
        <h3>${percip} in</h3>
        <h2>Percipitation</h2>
    </div>
    <div class="wind extras">
        <img src="img/Wind.png" width="80px" height="80px" alt="">
        <br>
        <h3>${wind} mph</h3>
        <h3>${wind_kph} kph</h3>
        <h3>${wind_dir}</h3>
        <h2>Wind</h2>
    </div>
    <div class="uv extras">
        <img src="img/Uv.png" width="80px" height="80px" alt="">
        <br>
        <h3>${uv}</h3>
        <h2>UV</h2>
    </div>
</div>
</div>
`;
        $('.glass').html(displayInfo);
        // Above was grabbing data for the the current day below I am repeating the same steps putting it underneath
        // I begin by creating a loop that will repeat the forcast code depending on the number of days

        // Here I am declaring a viarble that creates the template I will be using for the forcast days
        // console.log(data.forecast);
        // console.log(data.forecast.forecastday[0]);
        // console.log(data.forecast.forecastday[1]);
        // before I begin the loop I have to subtract a day from the user input values since we are already displaying the current day above

        let forcast = days - 1;
        let array = "";
        if(!forcast == 0){
            console.log(data.forecast); 
            for (let i = 0; i < forcast; i++) {
                let displayday = i + 1 ;
                let forecastDate = data.forecast.forecastday[displayday].date;
                let forcastImage = data.forecast.forecastday[displayday].day.condition.icon;
                let forcastText = data.forecast.forecastday[displayday].day.condition.text;
                let forecastTemp_c = data.forecast.forecastday[displayday].day.avgtemp_c;
                let forecastTemp_f = data.forecast.forecastday[displayday].day.avgtemp_f;
                let forecastHum = data.forecast.forecastday[displayday].day.avghumidity;
                let forecastPrecip_in = data.forecast.forecastday[displayday].day.totalprecip_in;
                let forecastPrecip_mm = data.forecast.forecastday[displayday].day.totalprecip_mm;
                let forecastwind = data.forecast.forecastday[displayday].day.maxwind_kph;
                let forecastwindmph = data.forecast.forecastday[displayday].day.maxwind_mph;
                let forecastuv = data.forecast.forecastday[displayday].day.uv;
                console.log(i);
                console.log(data.forecast.forecastday[displayday]);

                var displayForcast = ` <div class="day">
        <h2>Day ${displayday+1}</h2>
        <h4>${forecastDate}</h4>
        <img src="${forcastImage}" width="75px" walt="icon">
        <h4 class="dayName">${forcastText}</h4>
        <h4 class="temp">C° ${forecastTemp_c}</h4>
        <h4 class="temp">F° ${forecastTemp_f}</h4>
        <br>
        <h4>Hum. : ${forecastHum}%</h4>
        <h4>Percp. : ${forecastPrecip_in} in / ${forecastPrecip_mm } mm</h4>
        <h4>Wind : ${forecastwindmph} mph / ${forecastwind} kph</h4>
        <h4>UV : ${forecastuv}</h4>
        </div>`;
        
                array = array + displayForcast;
                $(".forcast").html(array)
    
              }
        }else{
            $(".forcast").html(array)
        }

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