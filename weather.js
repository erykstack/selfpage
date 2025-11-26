const API_KEY = "XXX "; /* Get you own API key on the https://openweathermap.org/ */ 

// Ustawienia
const LAT = 50.07;
const LON = 19.47;

function kelvinToCelsius(k) {
    return Math.round((k - 273.15) * 10) / 10;
}

async function loadWeather() {
    const widget = document.getElementById("weather-widget");

    try {
        const url =
            `https://api.openweathermap.org/data/2.5/weather?lat=${LAT}&lon=${LON}&appid=${API_KEY}`;

        const res = await fetch(url);
        const data = await res.json();

        if (data.cod !== 200) {
            widget.innerHTML = "Błąd pobierania danych.";
            return;
        }

        renderWeather(data);

    } catch (err) {
        console.error(err);
        widget.innerHTML = "Błąd połączenia z API.";
    }
}

function renderWeather(data) {
    const widget = document.getElementById("weather-widget");

    const temp = kelvinToCelsius(data.main.temp);
    const feels = kelvinToCelsius(data.main.feels_like);
    const desc = data.weather[0].description;
    const city = data.name;
    const country = data.sys.country;

    const humidity = data.main.humidity;
    const wind = data.wind.speed;

    const iconCode = data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

    widget.innerHTML = `
        <img class="icon" src="${iconUrl}" alt="${desc}" />
        <div class="weather-main">
            <div class="city">${city}, ${country}</div>
            <div class="temp-row">
                <div class="temp">${temp}°C</div>
                <div class="feels">odczuwalna: ${feels}°C</div>
            </div>
            <div class="desc">${desc}</div>
            <div class="details">
                Wiatr: ${wind} m/s • Wilgotność: ${humidity}%
            </div>
        </div>
    `;
}

loadWeather();
