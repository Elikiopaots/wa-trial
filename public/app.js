//Select Elements
const noti = document.querySelector('.notification');
const icon = document.querySelector('.weather-icon');
const tempVal = document.querySelector('.temperature-value');
const tempDesc = document.querySelector('.temperature-description');
const loc = document.querySelector('.location');

//App data and keys
const weather = {};

weather.temperature = {
  unit: 'celsius'
};

const K = 273;
const key = '82005d27a116c2880c8f0fcb866998a0';

//Check if browser supports Geolocation
if ('geolocation' in navigator) {
  navigator.geolocation.getCurrentPosition(success, fail);
} else {
  noti.style.display = 'block';
  noti.innerHTML = '<p>Browser does not support Geolocation</p>';
}

//User position function
function success(pos) {
  const lat = pos.coords.latitude;
  const lon = pos.coords.longitude;

  getWeather(lat, lon);
}

//Show error if there is problem with geolocation
function fail(err) {
  noti.style.display = 'block';
  noti.innerHTML = `<p>${err.message}</p>`;
}

//Request data from API
function getWeather(lat, lon) {
  const api = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}`;
  //const api = `http://api.openweathermap.org/data/2.5/weather?q=Yerev,am&appid=${key}`;

  axios
    .get(api)
    .then(res => {
      console.log(res);
      weather.temperature.value = Math.floor(res.data.main.temp - K);
      weather.city = res.data.name;
      weather.country = res.data.sys.country;
      weather.des = res.data.weather[0].description;
      weather.iconId = res.data.weather[0].icon;
    })
    .then(() => displayWeather())
    .catch(err => {
      noti.style.display = 'block';
      noti.innerHTML = `<p>Weather not found! Please check your input.</p>`;
    });
}

//Putting weather object into UI
function displayWeather() {
  icon.innerHTML = `<img src="./icons/${weather.iconId}.png" />`;
  tempVal.innerHTML = `<p>${weather.temperature.value}°<span>C</span></p>`;
  tempDesc.innerHTML = `<p>${weather.des}</p>`;
  loc.innerHTML = `<p>${weather.city}, ${weather.country}</p>`;
}

//Convert celsius to fahrenhait
function celsiusToFahrenheit(temp) {
  return (temp * 9) / 5 + 32;
}

//When user click on the temperature
tempVal.addEventListener('click', () => {
  if (weather.temperature.value === undefined) return;

  if (weather.temperature.unit === 'celsius') {
    let fahrenheit = celsiusToFahrenheit(weather.temperature.value);
    tempVal.innerHTML = `<p>${fahrenheit} °<span>F</span></p>`;
    weather.temperature.unit = 'fahrenheit';
  } else {
    tempVal.innerHTML = `<p>${weather.temperature.value} °<span>C</span></p>`;
    weather.temperature.unit = 'celsius';
  }
});
