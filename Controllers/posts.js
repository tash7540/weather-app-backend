import express from 'express';
const router = express.Router();
import request from 'request';
import groupByTime from 'group-by-time';

function groupday(value, index, array){
   let byday={};
    let d = new Date(value['dt'] * 1000);
    //let d = value['dt_text'];
    console.log(d);
    d = Math.floor(d.getTime()/(1000*60*60*24));
    console.log(d);
    byday[d]=byday[d]||[];
    byday[d].push(value);
  return byday
};

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

                // you shall also round off the value of the degrees fahrenheit calculated into two decimal places
                function roundToTwo(num) {
                  return +(Math.round(num + "e+2") + "e-2");
                }
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
    //let city = req.body.city;
    let city = 'denver'

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
            //var groupedByDay = groupByTime(weather.list, 'dt', 'day')

            //console.log(weather['list'][0]['dt']);
            for(var i in weather_grouped){
              console.log(Object.keys(weather_grouped[i]));

            }


            }
        })

};
export default router;
