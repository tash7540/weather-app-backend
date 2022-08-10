import express from 'express';
const router = express.Router();
import request from 'request';
import groupByTime from 'group-by-time';
import {groupday,getCardinalDirection,roundToTwo} from './Utils.js';

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
            console.log(weather);
            if (weather.main == undefined) {
                res.json({ error: err })

            } else {
                // we shall use the data got to set up your output
                const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
                var time = new Date();

                let place = `${weather.name}, ${weather.sys.country}`,
                  weatherTimezone = `${new Date(
                    weather.dt * 1000 - weather.timezone * 1000
                  )}`;
                let testday =new Date(weather.dt);

                let currdate = weatherTimezone.slice(4,15);
                var dayName = days[testday.getDay()];
                console.log(currdate);
                let weatherTemp = `${weather.main.temp}`,
                  weatherPressure = `${weather.main.pressure}`,
                  /* you will fetch the weather icon and its size using the icon data*/
                  weatherIcon = `http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`,
                  weatherDescription = `${weather.weather[0].description}`,
                  humidity = `${weather.main.humidity}`,
                  clouds = `${weather.clouds.all}`,
                  visibility = `${weather.visibility}`,
                  main = `${weather.weather[0].main}`,
                  weatherFahrenheit;
                weatherFahrenheit = (weatherTemp * 9) / 5 + 32;
                var weatherDescription1 = weatherDescription.split(' ');
                weatherDescription1 = weatherDescription1.map((word)=> word[0].toUpperCase()+word.slice(1,word.length));
                console.log(weatherDescription1);
                weatherDescription = weatherDescription1[0]+' '+weatherDescription1[1];
                let direction = utils.getCardinalDirection(weather.wind.deg);
                let windSpeed = `${weather.wind.speed} m/s ${direction}`;

                weatherFahrenheit = utils.roundToTwo(weatherFahrenheit);
                // you shall now render the data to your page (index.ejs) before displaying it out
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

            // you shall output it in the console just to make sure that the data being displayed is what you want
            let weather_grouped = (weather['list']).map(utils.groupday);

            var data_min = {};
            var data_max = {};

            for(var i in weather_grouped){
              data_min[Object.keys(weather_grouped[i])[0]] = [];
              data_max[Object.keys(weather_grouped[i])[0]] = [];

            }
            for(var i in weather_grouped){
              var a = Object.keys(weather_grouped[i])[0];
              data_min[Object.keys(weather_grouped[i])[0]].push(weather_grouped[i][a][0]['main']['temp_min']);
              data_max[Object.keys(weather_grouped[i])[0]].push(weather_grouped[i][a][0]['main']['temp_max']);

            }
            const temps_min = [];
            const temps_max = [];

            for(var i in data_min){
              var sum_min = 0;
              var sum_max = 0;

              for(var j in data_min[i]){
                sum_min = sum_min+data_min[i][j];
              }
              for(var j in data_max[i]){
                sum_max = sum_max+data_max[i][j];
              }
              temps_min.push(sum_min/data_min[i].length);
              temps_max.push(sum_max/data_max[i].length);

            }

            res.json({
              day1_min:utils.roundToTwo(temps_min[0]),
              day2_min:utils.roundToTwo(temps_min[1]),
              day3_min:utils.roundToTwo(temps_min[2]),
              day4_min:utils.roundToTwo(temps_min[3]),
              day5_min:utils.roundToTwo(temps_min[4]),
              day1_max:utils.roundToTwo(temps_max[0]),
              day2_max:utils.roundToTwo(temps_max[1]),
              day3_max:utils.roundToTwo(temps_max[2]),
              day4_max:utils.roundToTwo(temps_max[3]),
              day5_max:utils.roundToTwo(temps_max[4])
            });

            }
        })

};
export default router;
