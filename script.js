let cityInput = document.getElementById('city_input'),
    searchBtn = document.getElementById('searchBtn'),
    locationBtn = document.getElementById('locationBtn');
let api_key = '78b273a16eab1bad111bcd9f43b032a5';
let currentWeatherCard = document.querySelectorAll('.weather-left .card')[0];
let fiveDaysForecastCard = document.querySelector('.day-forecast');
let aqicard = document.querySelectorAll('.highlights .card')[0];
let sunrisecard = document.querySelectorAll('.highlights .card')[1];
let humidityVal = document.getElementById('humidityVal');
let pressureVal = document.getElementById('PressureVal');
let visibilityVal = document.getElementById('VisibilityVal');
let WindSpeedVal = document.getElementById('WindSpeedVal');
let FeelsVal = document.getElementById('FeelsVal');
let hourlyforecastcard = document.querySelector('.hourly-forecast');
let aqilist = ['Good', 'Fair', 'Moderate', 'Poor', 'Very Poor'];

function getWeatherDetails(Name, lat, lon, country, state) {
    let FORECAST_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${api_key}`,
        WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}`,
        AIR_POLLUTION_API_URL = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${api_key}`,
        days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    fetch(AIR_POLLUTION_API_URL)
        .then(res => res.json())
        .then(data => {
            let { co, no, no2, o3, so2, pm2_5, pm10, nh3 } = data.list[0].components;
            aqicard.innerHTML = `
                <div class="card-head">
                    <p>Air Quality Index</p>
                    <p class="air-index aqi-${data.list[0].main.aqi}">${aqilist[data.list[0].main.aqi - 1]}</p>
                </div>
                <div class="air-indices">
                    <div class="icon-wrapper">
                        <img src="https://img.icons8.com/?size=100&id=wGscuXAAEzt4&format=gif" alt="">
                    </div>
                    <i class="fa-regular fa-wind fa-3x"></i>
                    <div class="item"><p>PM2.5</p><h2>${pm2_5}</h2></div>
                    <div class="item"><p>PM10</p><h2>${pm10}</h2></div>
                    <div class="item"><p>SO2</p><h2>${so2}</h2></div>
                    <div class="item"><p>CO</p><h2>${co}</h2></div>
                    <div class="item"><p>NO</p><h2>${no}</h2></div>
                    <div class="item"><p>NO2</p><h2>${no2}</h2></div>
                    <div class="item"><p>NH3</p><h2>${nh3}</h2></div>
                    <div class="item"><p>O3</p><h2>${o3}</h2></div>
                </div>
            `;
        })
        .catch(() => alert('Failed to fetch Air Quality index'));

    fetch(WEATHER_API_URL)
        .then(res => res.json())
        .then(data => {
            console.log("Weather Data:", data);
            let date = new Date();
            currentWeatherCard.innerHTML = `
                <div class="current-weather">
                    <div class="details">
                        <p>Now</p>
                        <h2>${(data.main.temp - 273.15).toFixed(2)}&deg;C</h2>
                        <p>${data.weather[0].description}</p>
                    </div>
                    <div class="weather-icon">
                        <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="">
                    </div>
                </div>
                <hr>
                <div class="card-footer">
                    <p><i class="fa-light fa-calendar"></i> ${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]}</p>
                    <p><i class="fa-light fa-location-dot"></i> ${Name}, ${country}</p>
                </div>
            `;
            
            let { sunrise, sunset } = data.sys,
                { timezone, visibility } = data,
                { humidity, pressure, feels_like } = data.main,
                { speed } = data.wind;

            console.log("Weather Info:", { humidity, pressure, visibility, speed, feels_like });

            let sRisetime = moment.utc(sunrise, 'X').add(timezone, 'seconds').format('hh:mm A');
            let sSettime = moment.utc(sunset, 'X').add(timezone, 'seconds').format('hh:mm A');

            sunrisecard.innerHTML = `
                <div class="card-head">
                    <p>Sunrise & Sunset</p>
                </div>
                <div class="sunrise-sunset">
                    <div class="item">
                        <div class="icon-wrapper">
                            <img src="https://img.icons8.com/?size=100&id=UVozAtZxkZo8&format=gif" alt="">
                        </div>
                        <div class="icon">
                            <i class="fa-light fa-sun fa-4x"></i>
                        </div>
                        <div>
                            <p>Sunrise</p>
                            <h2>${sRisetime}</h2>
                        </div>
                    </div>
                    <div class="item">
                        <div class="icon-wrapper">
                            <img src="https://img.icons8.com/?size=100&id=TQmebUyo2xqZ&format=gif" alt="">
                        </div>
                        <div class="icon">
                            <i class="fa-light fa-sunset fa-4x"></i>
                        </div>
                        <div>
                            <p>Sunset</p>
                            <h2>${sSettime}</h2>
                        </div>
                    </div>
                </div>
            `;

            humidityVal.innerHTML = `${humidity}%`;
            pressureVal.innerHTML = `${pressure} hPa`;
            visibilityVal.innerHTML = `${(visibility / 1000).toFixed(2)} km`;
            WindSpeedVal.innerHTML = `${speed} m/s`; 
            FeelsVal.innerHTML = `${(feels_like - 273.15).toFixed(2)}&deg;C`; 
        })
        .catch((error) => {
            console.error("Error fetching weather data:", error);
            alert('Failed to fetch current weather');
        });

    fetch(FORECAST_API_URL)
        .then(res => res.json())
        .then(data => {
            let hourlyForecast = data.list;
            hourlyforecastcard.innerHTML = '';
            for (let i = 0; i <= 7; i++) {
                let hrForecast = new Date(hourlyForecast[i].dt_txt);
                let hr = hrForecast.getHours();
                let a = hr < 12 ? 'AM' : 'PM';
                if (hr == 0) hr = 12;
                if (hr > 12) hr -= 12;
                hourlyforecastcard.innerHTML += `
                    <div class="card">
                        <p>${hr} ${a}</p>
                        <img src="https://openweathermap.org/img/wn/${hourlyForecast[i].weather[0].icon}.png" alt="">
                        <p>${(hourlyForecast[i].main.temp - 273.15).toFixed(2)}&deg;C</p>
                    </div>
                `;
            }

            let uniqueForecastDays = [];
            let fiveDaysForecast = data.list.filter(forecast => {
                let forecastDate = new Date(forecast.dt_txt).getDate();
                if (!uniqueForecastDays.includes(forecastDate)) {
                    uniqueForecastDays.push(forecastDate);
                    return true;
                }
                return false;
            });

            fiveDaysForecastCard.innerHTML = '';
            fiveDaysForecast.forEach((forecast) => {
                let date = new Date(forecast.dt_txt);
                fiveDaysForecastCard.innerHTML += `
                    <div class="forecast-item">
                        <div class="icon-wrapper">
                            <img src="https://openweathermap.org/img/wn/${forecast.weather[0].icon}.png" alt="">
                            <span>${(forecast.main.temp - 273.15).toFixed(2)}&deg;C</span>
                        </div>
                        <p>${date.getDate()} ${months[date.getMonth()]}</p>
                        <p>${days[date.getDay()]}</p>
                    </div>
                `;
            });
        })
        .catch(() => alert('Failed to fetch weather forecast'));
}

function getCityCoordinates() {
    let cityName = cityInput.value.trim();
    cityInput.value = '';
    if (!cityName) return;
    let GEOCODING_API_URL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${api_key}`;

    fetch(GEOCODING_API_URL)
        .then(res => res.json())
        .then(data => {
            if (data.cod !== 200) {
                alert(`City not found: ${cityName}`);
                return;
            }
            let { name, coord: { lat, lon }, sys: { country }, state } = data;
            getWeatherDetails(name, lat, lon, country, state || '');
        })
        .catch(() => alert(`Failed to fetch coordinates for ${cityName}`));
}

function getUserCoordinates() {
    navigator.geolocation.getCurrentPosition(position => {
        let { latitude, longitude } = position.coords;
        let REVERSE_GEOCODING_URL = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&appid=${api_key}`;

        fetch(REVERSE_GEOCODING_URL)
            .then(res => res.json())
            .then(data => {
                let { name, country, state } = data[0];
                getWeatherDetails(name, latitude, longitude, country, state);
            })
            .catch(() => alert('Failed to fetch user coordinates'));
    }, error => {
        if (error.code === error.PERMISSION_DENIED) {
            alert('Geolocation permission denied. Please reset location permission to grant access again.');
        }
    });
}

searchBtn.addEventListener('click', getCityCoordinates);
locationBtn.addEventListener('click', getUserCoordinates);
cityInput.addEventListener('keyup', e => {
    if (e.key === 'Enter') {
      getCityCoordinates();
    }
  });
window.addEventListener('load' , getUserCoordinates);  