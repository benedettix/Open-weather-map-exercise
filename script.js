// https://pro.openweathermap.org/data/2.5/forecast/climate?lat={lat}&lon={lon}&appid={API key}
// https://pro.openweathermap.org/data/2.5/forecast/climate?q={city name},{country code}&appid={API key}

let apiKey = "9a72a61afead8d5eacc564f00fe63a53";
let inputCity = document.querySelector('[name="city"]');
let searchBtn = document.querySelector('[name="search"]');
let homeCityBtn = document.querySelector('[name="homeCity"]');
let currentDiv = document.querySelector(".current");
let dailyDiv = document.querySelector(".daily");
let cityInfo = {};


searchBtn.addEventListener('click', getCityInfo);
homeCityBtn.addEventListener('click', saveInfo);

if(localStorage.getItem('homeCity')) {
    cityInfo = JSON.parse(localStorage.getItem('homeCity'))
    let url =  `https://api.openweathermap.org/data/2.5/onecall?lat=${cityInfo.lat}&lon=${cityInfo.lon}&appid=${apiKey}&units=metric`
    sendRequest(url, displayWeatherData);
}


function saveInfo() {
    localStorage.setItem("homeCity", JSON.stringify(cityInfo));
}

function getCityInfo() {
    let url = `http://api.openweathermap.org/geo/1.0/direct?q=${inputCity.value}&appid=${apiKey}`
    sendRequest(url, getWeatherData);
}


function sendRequest (url, callbackfunction) {
    let xml = new XMLHttpRequest();
    xml.open("get", url);
    xml.onreadystatechange = function () {
      if (xml.readyState === 4 && xml.status === 200) {
        callbackfunction(JSON.parse(xml.responseText));
      }
    };
    xml.send();
}

function getWeatherData(weatherData) {

    cityInfo = {
        country: weatherData[0].country,
        lat: weatherData[0].lat,
        lon: weatherData[0].lon,
        name: weatherData[0].name,
      };

      let url =  `https://api.openweathermap.org/data/2.5/onecall?lat=${cityInfo.lat}&lon=${cityInfo.lon}&appid=${apiKey}&units=metric`;
      sendRequest(url, displayWeatherData);
}

function displayWeatherData(weatherData) {
    console.log(weatherData);
    let current = weatherData.current;
  let daily = weatherData.daily;
  let currentIcon = current.weather[0].icon;

  let text = ``;
  text += `<img src="http://openweathermap.org/img/wn/${currentIcon}@2x.png" alt="">`;
  text += `<h1>${cityInfo.name},${cityInfo.country}</h1>`
  text += `<h3>Day name: ${dayName(current.dt)}</h3>`;
  text += `<h2>Todays temperature is ${Math.floor(current.temp)} °C</h2>`

  currentDiv.innerHTML = text;

  text = ``;
  daily.forEach((day) => {
    text += `<div class="col-3">`;
    text += `<img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="">`;
    text += `<h5>Day name: ${dayName(day.dt)}</h5>`;
    text += `<p>Max temperature ${Math.floor(day.temp.max)} °C, Min temperature ${Math.floor(day.temp.min)} °C</p>`
    text += `</div>`;
  })
  dailyDiv.innerHTML = text;
}

function dayName(value) {
    let calculated = new Date(value * 1000);
let days = ["Monday","Tuesday","Wendsay","Thursday","Friday","Saturday","Sunday"];
return days[calculated.getDay()];

}