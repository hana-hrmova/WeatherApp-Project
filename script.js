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

function initialPage(response) {
  let h1 = document.querySelector("#current-temperature");
  let initialTemp = Math.round(response.data.main.temp);
  publicTemp = initialTemp;
  h1.innerHTML = initialTemp + "°C";
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
  h1.innerHTML = temp + "°C";
  publicTemp = temp;
}

function displayTemperatureHere(response) {
  let temp = Math.round(response.data.main.temp);
  let h1 = document.querySelector("#current-temperature");
  h1.innerHTML = temp + "°C";
  publicTemp = temp;
  let here = document.querySelector("#city-name");
  here.innerHTML = response.data.name;
}

let form = document.querySelector("#submit-form");
form.addEventListener("submit", enteredCity);
form.addEventListener("submit", displayTemperature);

function degreesCelzius(event) {
  event.preventDefault();
  let currentTemperature = document.querySelector("#current-temperature");
  currentTemperature.innerHTML = publicTemp + "°C";
}

function degreesFahrenheit(event) {
  event.preventDefault();
  let currentTemperature = document.querySelector("#current-temperature");
  currentTemperature.innerHTML = (publicTemp * 9) / 5 + 32 + "°F";
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

let celzius = document.querySelector("#celzius");
celzius.addEventListener("click", degreesCelzius);

let fahrenheit = document.querySelector("#fahrenheit");
fahrenheit.addEventListener("click", degreesFahrenheit);

let current = document.querySelector("#current");
current.addEventListener("click", getCurrentPosition);
