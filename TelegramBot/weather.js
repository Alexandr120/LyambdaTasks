require('dotenv').config();
const axios = require('axios').default;
const weekdays = require('../TelegramBot/weekdays.json');
const months = require('../TelegramBot/months.json');

const getWeather = async (hourOption) => {
  let weatherData = await getWeatherData();
  let result = '';
    for (let [key, item] of weatherData) {
        result = result + `${key} \n`;
        for(let i=0; i<item.length; i++){
            if(hourOption === '6' && i !== 0 && i !== item.length-1){
                i++;
            }
            result = result + `   ${item[i].time}, ${item[i].temp}, ощущается: ${item[i].feel_like}, ${item[i].weather} \n`
        }
    }
  return result;
}


const getWeatherData = async () => {
    let weatherData = false;
    let cityCoordinates = await getCityCoordinates(); // I can try search coordinates for target city
    if(cityCoordinates){
        await axios.get('http://api.openweathermap.org/data/2.5/forecast', {
            params : {
                lat : cityCoordinates.lat,
                lon : cityCoordinates.lon,
                appid : process.env.OPEN_WEATHER_MAP_API_KEY,
                units : 'metric',
                lang : 'ru'
            }
        }).then((response) => {
            if(response.status === 200){
                let list = response.data.list;
                weatherData = weatherMapper(list);
            }
        }).catch((err)=>{
            console.log(err);
        });
        return weatherData;
    }
}

const weatherMapper = (data) => {
    let arr = new Map([]);
    for (let i=0; i<data.length; i++){
        let dateTime = new Date(data[i].dt_txt);
        // let date = dateTime.toLocaleDateString('ru', { // result this method not like this -> '12 |-F16: Sun-|'. I created custom date map
        //     weekday: "long",
        //     day: "numeric",
        //     month: "long"
        // });
        let date = parseDate(dateTime.toDateString());
        let hour = dateTime.getHours();
        if(hour >=6 && hour <= 21) {
            if (!arr.has(`${date}`)) {
                arr.set(`${date}`, []);
            }
            let obj = {};
            let time = (hour < 10) ? `0${dateTime.toLocaleTimeString()}` : dateTime.toLocaleTimeString();
            obj.time = time.substr(0, 5);
            obj.temp = (data[i].main.temp > 0) ? `+${Math.round(data[i].main.temp)} °C` : `-${Math.round(data[i].main.temp)} °C`;
            obj.feel_like = (data[i].main.feels_like > 0) ? `+${Math.round(data[i].main.feels_like)} °C` : `-${Math.round(data[i].main.feels_like)} °C`;
            obj.weather = data[i].weather[0].description;
            let arrKey = arr.get(`${date}`);
            arrKey.push(obj);
        }
    }
    return arr;
}

const parseDate = (date) => {
    let weekday = weekdays[date.substr(0, 3)];
    let month = months[date.substr(4, 3)];
    let day = date.substr(8, 2);
    if(day.indexOf('0') === 0){
        day = day.replace('0', '');
    }

    return `${weekday}, ${day} ${month}`;
}

const getCityCoordinates = async () => {
    let coordinates = {};
    await axios.get('http://api.openweathermap.org/geo/1.0/direct', {
        params : {
            q : 'Dnipro',
            limit: 1,
            appid: process.env.OPEN_WEATHER_MAP_API_KEY
        }
    }).then((response) => {
        if(response.status === 200){
            coordinates.lat = response.data[0].lat;
            coordinates.lon = response.data[0].lon;
        } else return ;
    }).catch((err)=>{
        console.log(err);
    });
    return coordinates;
}

module.exports = { getWeather };
