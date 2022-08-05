import express from 'express';
const router = express.Router();
import request from 'request';
import groupByTime from 'group-by-time';

function groupday(value, index, array){
   let byday={};
    let d = new Date(value['dt'] * 1000);
    //let d = value['dt_text'];
    d = Math.floor(d.getTime()/(1000*60*60*24));
    byday[d]=byday[d]||[];
    byday[d].push(value);
  return byday
};
// you shall also round off the value of the degrees fahrenheit calculated into two decimal places
function roundToTwo(num) {
  return +(Math.round(num + "e+0") + "e-0");
}

export const citySearch = async (req, res) => {

    // Get city name passed in the form
    let city = req.body.city;
    // Use that city name to fetch data
    // Use the API_KEY in the '.env' file
    console.log("TT+"+req.body);
    let url = `http://api.openweathermap.org/data/2.5/weather?q=${req.body.city}&units=metric&appid=${process.env.API_KEY}`;
    //app.use('/posts', postRoutes);
    // Request for data using the URL
    console.log(url);
    request(url, function(err, response, body) {

        // On return, check the sjson data fetched
        if (err) {
            res.json({ error: err })

          //  res.render('index', { weather: null, error: 'Error, please try again' });
        } else {
            let weather = JSON.parse(body);
            // you shall output it in the console just to make sure that the data being displayed is what you want
            console.log(weather);
            if (weather.main == undefined) {
                res.json({ error: err })

              //  res.render('index', { weather: null, error: 'Error, please try again' });
            } else {
                // we shall use the data got to set up your output
                let place = `${weather.name}, ${weather.sys.country}`,
                  /* you shall calculate the current timezone using the data fetched*/
                  weatherTimezone = `${new Date(
                    weather.dt * 1000 - weather.timezone * 1000
                  )}`;
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

                weatherFahrenheit = roundToTwo(weatherFahrenheit);
                // you shall now render the data to your page (index.ejs) before displaying it out
                res.json({
                  weather: weather,
                  place: place,
                  temp: weatherTemp,
                  pressure: weatherPressure,
                  icon: weatherIcon,
                  description: weatherDescription,
                  timezone: weatherTimezone,
                  humidity: humidity,
                  fahrenheit: weatherFahrenheit,
                  clouds: clouds,
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
    //let city = 'boulder'

    // Use that city name to fetch data
    // Use the API_KEY in the '.env' file
    let url = `http://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${process.env.API_KEY}`;
    //app.use('/posts', postRoutes);
    // Request for data using the URL
    console.log(url);
    request(url, function(err, response, body) {

        // On return, check the sjson data fetched
        if (err) {
            res.json({ error: err })

          //  res.render('index', { weather: null, error: 'Error, please try again' });
        } else {
            var weather = JSON.parse(body);

            // you shall output it in the console just to make sure that the data being displayed is what you want
            let weather_grouped = (weather['list']).map(groupday);

            var data_min = {};
            var data_max = {};
            //console.log(Object.keys(weather_grouped[0])[0]);
            //console.log(weather_grouped[0]['19209'][0]['main']['temp']);//20+17+5=14
            for(var i in weather_grouped){
              data_min[Object.keys(weather_grouped[i])[0]] = [];
              data_max[Object.keys(weather_grouped[i])[0]] = [];

            //  console.log(weather_grouped[i][Object.keys(weather_grouped[i])[0]]);
            }
            for(var i in weather_grouped){
              //console.log(weather_grouped[Object.keys(weather_grouped[i])]);
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
            //console.log(Object.keys(weather_grouped[0]));
            //for(i in data){
            //  console.log(i+"asd"+data[i]);
            //}
            res.json({
              day1_min:roundToTwo(temps_min[0]),
              day2_min:roundToTwo(temps_min[1]),
              day3_min:roundToTwo(temps_min[2]),
              day4_min:roundToTwo(temps_min[3]),
              day5_min:roundToTwo(temps_min[4]),
              day1_max:roundToTwo(temps_max[0]),
              day2_max:roundToTwo(temps_max[1]),
              day3_max:roundToTwo(temps_max[2]),
              day4_max:roundToTwo(temps_max[3]),
              day5_max:roundToTwo(temps_max[4])
            });

            }
        })

};
export default router;
