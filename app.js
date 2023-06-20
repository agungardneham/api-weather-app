require("dotenv").config();
const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res){
    res.sendFile(__dirname + "/index.html");
})

app.post("/", function(req, res){
    let city = req.body.city;
    let link = "https://api.openweathermap.org/data/2.5/weather?q=" + city +"&appid=" + process.env.API_KEY + "&units=metric";
    https.get(link, function(response){
        console.log(response.statusCode);
        response.on("data", function(data){
            const weatherData = JSON.parse(data);
            const weatherTemp = weatherData.main.temp;
            const weatherDesc = weatherData.weather[0].description;
            const weatherIcon = weatherData.weather[0].icon;
            const weatherImg = "https://openweathermap.org/img/wn/" + weatherIcon + "@2x.png";
            res.setHeader('Content-Type', 'text/html');
            res.write("<img src=" + weatherImg + ">")
            res.write("<h1>The weather of " + city + " right now is " + weatherDesc + "</h1>");
            res.write("<h2>The temperature is " + weatherTemp + " degree celsius");
            res.send();
        })
    })
})

app.listen(3000, function(){
    console.log("Server is running on port 3000 ....");
})