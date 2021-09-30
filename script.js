let apiKey = "80a20630f94746a928bf00c16d04f78c";
let publicTemp = 0;

let now = new Date();
let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
let day = days[now.getDay()];
let hour = now.getHours();
let minute = now.getMinutes();
if (minute < 10) {
  minute = `0${now.getMinutes()}`;
}

let h5 = document.querySelector("#date");
h5.innerHTML = `${day}, ${hour}:${minute}`;

let apiUrlKrakow = `https://api.openweathermap.org/data/2.5/weather?q=Kraków&units=metric&appid=80a20630f94746a928bf00c16d04f78c`;
axios.get(apiUrlKrakow).then(initialPage);

function forecastDaysAPI(coordinates) {
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecastDays);
}

function forecastHoursAPI(coordinates) {
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecastHours);
}

function initialPage(response) {
  let h1 = document.querySelector("#current-temperature");
  let initialTemp = Math.round(response.data.main.temp);
  let description = document.querySelector("#weather-description");
  let humidity = document.querySelector("#humidity");
  let windSpeed = document.querySelector("#wind");
  let icon = document.querySelector("#icon");

  publicTemp = initialTemp;
  h1.innerHTML = initialTemp + "°C";
  description.innerHTML = response.data.weather[0].description;
  windSpeed.innerHTML = `Wind Speed: ${Math.round(
    response.data.wind.speed
  )}km/h`;
  humidity.innerHTML = `Humidity: ${response.data.main.humidity}%`;
  icon.setAttribute("src", `images/${response.data.weather[0].icon}@2x.png`);
  icon.setAttribute("alt", response.data.weather[0].description);

  forecastDaysAPI(response.data.coord);
  forecastHoursAPI(response.data.coord);
}

function enteredCity(event) {
  event.preventDefault();
  let city = document.querySelector("#entered-city");
  let h1 = document.querySelector("h1");
  let cityName = city.value;
  h1.innerHTML = city.value;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=80a20630f94746a928bf00c16d04f78c`;
  axios.get(apiUrl).then(displayTemperature);
}

function displayTemperature(response) {
  let temp = Math.round(response.data.main.temp);
  let h1 = document.querySelector("#current-temperature");
  let description = document.querySelector("#weather-description");
  let windSpeed = document.querySelector("#wind");
  let humidity = document.querySelector("#humidity");
  let icon = document.querySelector("#icon");

  h1.innerHTML = temp + "°C";
  publicTemp = temp;
  description.innerHTML = response.data.weather[0].description;
  windSpeed.innerHTML = `Wind Speed: ${Math.round(
    response.data.wind.speed
  )}km/h`;
  humidity.innerHTML = `Humidity: ${response.data.main.humidity}%`;
  icon.setAttribute("src", `images/${response.data.weather[0].icon}@2x.png`);
  icon.setAttribute("alt", response.data.weather[0].description);

  forecastDaysAPI(response.data.coord);
  forecastHoursAPI(response.data.coord);
}

function displayTemperatureHere(response) {
  let temp = Math.round(response.data.main.temp);
  let h1 = document.querySelector("#current-temperature");
  let here = document.querySelector("#city-name");
  let description = document.querySelector("#weather-description");
  let windSpeed = document.querySelector("#wind");
  let humidity = document.querySelector("#humidity");
  let icon = document.querySelector("#icon");

  publicTemp = temp;
  h1.innerHTML = temp + "°C";
  here.innerHTML = response.data.name;
  humidity.innerHTML = `Humidity: ${response.data.main.humidity}%`;
  windSpeed.innerHTML = `Wind Speed: ${Math.round(
    response.data.wind.speed
  )}km/h`;
  description.innerHTML = response.data.weather[0].description;
  icon.setAttribute("src", `images/${response.data.weather[0].icon}@2x.png`);
  icon.setAttribute("alt", response.data.weather[0].description);

  forecastDaysAPI(response.data.coord);
  forecastHoursAPI(response.data.coord);
}

let form = document.querySelector("#submit-form");
form.addEventListener("submit", enteredCity);
form.addEventListener("submit", displayTemperature);

function formatDays(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[day];
}

function displayForecastDays(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#forecast-days");
  let forecastElementHTML = "";
  forecast.forEach(function (dailyForecast, index) {
    if (index < 6 && index > 0) {
      forecastElementHTML =
        forecastElementHTML +
        `<li>
    ${formatDays(dailyForecast.dt)}
        <img
            src="images/${
              dailyForecast.weather[0].icon
            }@2x.png" width=30px height=30px
          />  
          <span class="daily-forecast-max">
          ${Math.round(
            dailyForecast.temp.max
          )}</span><span class="degree-unit">°C</span> / <span class="daily-forecast-min">${Math.round(
          dailyForecast.temp.min
        )}</span><span class="degree-unit">°C</span>
    </li>`;
    }
  });

  forecastElement.innerHTML = forecastElementHTML;
}

function formatHours(timestamp) {
  let date = new Date(timestamp * 1000);
  let hours = date.getHours();
  return hours;
}

function displayForecastHours(response) {
  console.log(response.data.hourly);
  let forecastHourly = response.data.hourly;

  let forecastHourlyElement = document.querySelector("#forecast-hourly");
  let forecastHourlyElementHTML = `<div class="row">`;
  forecastHourly.forEach(function (hourlyForecast, index) {
    if (index > 0 && index < 7) {
      forecastHourlyElementHTML =
        forecastHourlyElementHTML +
        `
       <div class="col-sm border">

      <span class="hourly-temp">${Math.round(
        hourlyForecast.temp
      )}</span><span class="degree-unit"> °C</span>
      <br />
      <img
            src="images/${
              hourlyForecast.weather[0].icon
            }@2x.png" width=30px height=30px
          />  
          <br />
          ${formatHours(hourlyForecast.dt)}:00
       </div>
      `;
    }
  });
  forecastHourlyElementHTML = forecastHourlyElementHTML + `</div>`;
  forecastHourlyElement.innerHTML = forecastHourlyElementHTML;
}

function degreesCelzius(event) {
  event.preventDefault();
  let currentTemperature = document.querySelector("#current-temperature");
  currentTemperature.innerHTML = publicTemp + "°C";
  let hourlyTemp = document.querySelectorAll(".hourly-temp");
  hourlyTemp.forEach(function (temp) {
    let currentTemp = temp.innerHTML;
    temp.innerHTML = Math.round(((currentTemp - 32) * 5) / 9);
  });
  let dailyTempMax = document.querySelectorAll(".daily-forecast-max");
  dailyTempMax.forEach(function (item) {
    let currentTemp = item.innerHTML;
    item.innerHTML = Math.round(((currentTemp - 32) * 5) / 9);
  });

  let dailyTempMin = document.querySelectorAll(".daily-forecast-min");
  dailyTempMin.forEach(function (item) {
    let currentTemp = item.innerHTML;
    item.innerHTML = Math.round(((currentTemp - 32) * 5) / 9);
  });

  let degreesUnits = document.querySelectorAll(".degree-unit");
  degreesUnits.forEach(function (units) {
    units.innerHTML = "°C";
  });

  celziusButton.removeEventListener("click", degreesCelzius);
  fahrenheitButton.addEventListener("click", degreesFahrenheit);
}

function degreesFahrenheit(event) {
  event.preventDefault();
  let currentTemperature = document.querySelector("#current-temperature");
  currentTemperature.innerHTML = Math.round((publicTemp * 9) / 5 + 32) + "°F";
  let hourlyTemp = document.querySelectorAll(".hourly-temp");
  hourlyTemp.forEach(function (temp) {
    let currentTemp = temp.innerHTML;
    temp.innerHTML = Math.round((currentTemp * 9) / 5 + 32);
  });

  let dailyTempMax = document.querySelectorAll(".daily-forecast-max");
  dailyTempMax.forEach(function (item) {
    let currentTemp = item.innerHTML;
    item.innerHTML = Math.round((currentTemp * 9) / 5 + 32);
  });

  let dailyTempMin = document.querySelectorAll(".daily-forecast-min");
  dailyTempMin.forEach(function (item) {
    let currentTemp = item.innerHTML;
    item.innerHTML = Math.round((currentTemp * 9) / 5 + 32);
  });

  let degreesUnits = document.querySelectorAll(".degree-unit");
  degreesUnits.forEach(function (units) {
    units.innerHTML = "°F";
  });

  celziusButton.addEventListener("click", degreesCelzius);
  fahrenheitButton.removeEventListener("click", degreesFahrenheit);
}

function displayCurrent(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

  axios.get(apiUrl).then(displayTemperatureHere);
}

function getCurrentPosition() {
  navigator.geolocation.getCurrentPosition(displayCurrent);
}

let celziusButton = document.querySelector("#celzius");
celzius.addEventListener("click", degreesCelzius);

let fahrenheitButton = document.querySelector("#fahrenheit");
fahrenheit.addEventListener("click", degreesFahrenheit);

let current = document.querySelector("#current");
current.addEventListener("click", getCurrentPosition);
