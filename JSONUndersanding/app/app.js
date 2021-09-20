function displayData(){
    $.getJSON("../data/data.json", function(data){
        let num = 0;
        $(data).each(function(){
            var displayInformation = ` <div class="info">
            <h1 class="header">ID:</h1> 
                <p class="text">${data[num].id}</p>
            <h1>Last Name:</h1>
                <p class="text">${data[num].last_name}</p>
            <h1>Email:</h1>
                <p class="text">${data[num].email}</p>
            <h1>Gender</h1>
                <p class="text">${data[num].gender}</p>
            <h1>City:</h1>
                <p class="text">${data[num].city}</p>
            <h1>Cars Models:</h1>
                <div class="carText cars${num}">
                </div>
                <hr>
        </div>
        `
        $("#app").append(displayInformation);
        let carNum = 0;
        $(data[num].car_model).each(function(){
            var displayCarInfo = `
                <p>${data[num].car_model[carNum].car_name}</p>
            `;
            $(`.cars${num}`).append(displayCarInfo);
            carNum++;
        });
        num++;
        });
    });
}

$(document).ready(function(){
    displayData();
});