const express = require("express");
const https = require("https")
const bodyParser = require("body-parser");
require("dotenv").config()
const app = express();

var icon;
var imageUrl;
var temp;
var city = "Jersey City";
var weathDescription;
const WEATHER_KEY = process.env.WEATHER_KEY;
const units = "imperial";



app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}))

app.get("/", function(req, res) {

  const url = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + WEATHER_KEY + "&units=" + units
  console.log(url)
  https.get(url, function(response) {
    response.on("data", function(data) {
      var weatherData = JSON.parse(data);
      temp = Math.round(weatherData.main.temp);

      weatherDescription = weatherData.weather[0].description;
      icon = weatherData.weather[0].icon;
      imageUrl = "https:openweathermap.org/img/wn/" + icon + "@2x.png";

      res.render("index", {
        imageUrl: imageUrl,
        temp: temp,
        icon: icon,
        city: city
      })
    })
  })
})


app.get("/news", function(req, res) {
  const NYT_KEY = process.env.NYT_KEY
  const url = "https://api.nytimes.com/svc/topstories/v2/us.json?api-key=" + NYT_KEY
  https.get(url, function(response) {
    const chunks = [];

    response.on("data", function(data) {
      chunks.push(data)
      console.log(chunks)
    })

    response.on("end", function() {
      var headlines = []
      const body = Buffer.concat(chunks);
      const stories = JSON.parse(body);
      for (var i = 0; i <= 5; i++) {
        var headline = {
          title: stories.results[i].title,
          link: stories.results[i].url,
          image: stories.results[i].multimedia[0].url
        }
        headlines.push(headline)
      }
      console.log(headlines)
      console.log(stories.results[1])
      res.render("news", {
        headlines
      })
    })

  })
})

app.get("/sports", function(req, res) {

  const SPORTS_KEY = process.env.SPORTS_KEY;
  const url = "https://top-sports-news.p.rapidapi.com/espn/nba?rapidapi-key=" + SPORTS_KEY

  https.get(url, function(response) {
    const chunks = [];

    response.on("data", function(chunk) {
      chunks.push(chunk);
    });

    response.on("end", function() {
      var headlines = [];
      const body = Buffer.concat(chunks);
      const sportsHeadlines = JSON.parse(body);
      for (var i = 0; i <= 5; i++) {
        var articleObject = {
          title: sportsHeadlines.top_headlines[i].title,
          link: sportsHeadlines.top_headlines[i].href
        }
        headlines.push(articleObject)
      }
      console.log(sportsHeadlines);
      res.render("sports", {
        headlines
      })
    });
  });
  // req.end();
})



app.post("/", function(req, res) {
  city = req.body.city;
  const url = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + WEATHER_KEY + "&units=" + units

  https.get(url, function(response) {
    response.on("data", function(data) {
      var weatherData = JSON.parse(data);
      temp = Math.round(weatherData.main.temp);
      weatherDescription = weatherData.weather[0].description;
      icon = weatherData.weather[0].icon;
      imageUrl = "https:openweathermap.org/img/wn/" + icon + "@2x.png";
      console.log(imageUrl)

      res.redirect("/")
      // res.write("<div class='container-fluid weather'>")
      // res.write("<p id='weatherDescription'>The weather is currently " + weatherDescription + "</p>");
      // res.write("<h1>The temperature in " + query + " is " + temp + " degrees fahrenheight</h1>")
      // res.write("<img src=" + imageUrl + ">");
      // res.write("</div>")
      // res.send();
    })
  })
})

app.post("/sports", function(req, res){
  var category = req.body.sport;

  const SPORTS_KEY = process.env.SPORTS_KEY;
  const url = "https://top-sports-news.p.rapidapi.com/espn/"+category+"?rapidapi-key=" + SPORTS_KEY

  https.get(url, function(response) {
    const chunks = [];

    response.on("data", function(chunk) {
      chunks.push(chunk);
    });

    response.on("end", function() {
      var headlines = [];
      const body = Buffer.concat(chunks);
      const sportsHeadlines = JSON.parse(body);
      for (var i = 0; i <= 5; i++) {
        var articleObject = {
          title: sportsHeadlines.top_headlines[i].title,
          link: sportsHeadlines.top_headlines[i].href
        }
        headlines.push(articleObject)
      }
      console.log(sportsHeadlines);
      // res.redirect("/sports")
      res.render("sports", {
        headlines
      })
    });
  });
})

app.listen(process.env.PORT || 3000, function() {
  console.log("App listening on port 3000");
})
