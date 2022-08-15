import express from 'express';
const router = express.Router();
import request from 'request';
import groupByTime from 'group-by-time';
import {groupday,getCardinalDirection,roundToTwo,toFehrenhiet} from './Utils.js';

export const citySearch = async (req, res) => {

    // Get city name passed in the form
    let city = req.body.city;
    // Use the API_KEY in the '.env' file
    let url = `http://api.openweathermap.org/data/2.5/weather?q=${req.body.city}&units=metric&appid=${process.env.API_KEY}`;
    // Request for data using the URL
    console.log(url);
    request(url, function(err, response, body) {

        // On return, check the sjson data fetched
        if (err) {
            res.json({ error: err })

        } else {
            let weather = JSON.parse(body);
            // you shall output it in the console just to make sure that the data being displayed is what you want
            if (weather.main == undefined) {
                res.json({ error: err })

            } else {
                // we shall use the data got to set up your output
                const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
                let place = `${weather.name}, ${weather.sys.country}`,
                  timeString = `${new Date(
                    weather.dt * 1000 - weather.timezone * 1000
                  )}`;

                let time =new Date(weather.dt*1000 -weather.timezone*1000);
                let currdate = timeString.slice(4,15);
                var dayName = days[time.getDay()];
                let weatherTemp = `${roundToTwo(weather.main.temp)}`,
                  weatherPressure = `${weather.main.pressure}`,
                  /* you will fetch the weather icon and its size using the icon data*/
                  weatherIcon = `http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`,
                  weatherDescription = `${weather.weather[0].description}`,
                  humidity = `${weather.main.humidity}`,
                  clouds = `${weather.clouds.all}`,
                  visibility = `${weather.visibility}`,
                  main = `${weather.weather[0].main}`,
                  weatherFahrenheit;
                weatherFahrenheit = roundToTwo((weatherTemp * 9) / 5 + 32);
                var weatherDescriptionSplit = weatherDescription.split(' ');
                weatherDescriptionSplit= weatherDescriptionSplit.map((word)=> word[0].toUpperCase()+word.slice(1,word.length));
                weatherDescription = weatherDescriptionSplit[0]+' '+weatherDescriptionSplit[1];
                let direction = `${getCardinalDirection(weather.wind.deg)}`;
                let windSpeed = `${weather.wind.speed} m/s`;

                res.json({
                  weather: weather,
                  place: place,
                  temp: weatherTemp,
                  pressure: weatherPressure,
                  icon: weatherIcon,
                  description: weatherDescription,
                  time: time.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }),
                  date: currdate,
                  day: dayName,
                  humidity: humidity,
                  fahrenheit: weatherFahrenheit,
                  clouds: clouds,
                  windSpeed:windSpeed,
                  windDirection:direction,
                  visibility: visibility,
                  main: main,
                  error: null,
                });
              }
            }
        })

};
export const citySearchForecast = async (req, res) => {

    // Get city name passed in the form
    let city = req.body.city;
    // Use that city name to fetch data
    // Use the API_KEY in the '.env' file
    let url = `http://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${process.env.API_KEY}`;
    // Request for data using the URL
    console.log(url);
    request(url, function(err, response, body) {

        // On return, check the sjson data fetched
        if (err) {
            res.json({ error: err })

        } else {
            var weather = JSON.parse(body);
            const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
            let weather_grouped = (weather['list']).map(groupday);
            var data_temps = {};
            var data_icons = {};
            var data_days = {};
            for(var i in weather_grouped){
              data_temps[Object.keys(weather_grouped[i])[0]] = [];
              data_icons[Object.keys(weather_grouped[i])[0]] = "";
              data_days[Object.keys(weather_grouped[i])[0]] = "";

            }
            for(var i in weather_grouped){
              var a = Object.keys(weather_grouped[i])[0];
              data_temps[Object.keys(weather_grouped[i])[0]].push(weather_grouped[i][a][0]['main']['temp_max']);
              data_icons[Object.keys(weather_grouped[i])[0]] = weather_grouped[i][a][0]['weather'][0]['icon'];
              var testday =new Date(weather_grouped[i][a][0]['dt'] * 1000);
              data_days[Object.keys(weather_grouped[i])[0]] =days[testday.getDay()];

            }

            const data = [];
            for(const i in data_temps){
              var summ = 0;
              for(var j in data_temps[i]){
                summ = summ+data_temps[i][j];
              }
              var temp = summ /data_temps[i].length;
              var obj = {"tempC":roundToTwo(temp),
              "tempF":roundToTwo(toFehrenhiet(temp)),
              "day":data_days[i],
              "icon":data_icons[i]};
              data.push(obj);
            }
            console.log(data);
            res.json(data);

            }
        })

};
export const citySearchHistorical = async (req,res) => {
  var currentTime = new Date();
  let end = Math.floor(currentTime.getTime()/1000);
  //search 1 week back
  let start = Math.floor((currentTime.getTime()/1000) - (7*86400));
  let city = req.body.city;
  let url = `https://history.openweathermap.org/data/2.5/history/city?q=${city}&type=hour&start=${start}&end=${end}&appid=${process.env.API_KEY}`;
  console.log(url);
  request(url, function(err, response, body) {

      // On return, check the sjson data fetched
      if (err) {
          res.json({ error: err })

      } else {
          var weather = JSON.parse(body);
          console.log(weather);
          let weatherData = [];
          weather.list.map((data)=>{
            let stamp =new Date(data.dt * 1000);
            weatherData.push({x:stamp,y:roundToTwo(((data.main.temp -273.15)* 9) / 5 + 32)});
          });
          console.log(weatherData);
          res.json({weatherData});

      }
    });
};
export default router;
