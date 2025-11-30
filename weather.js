const API_KEY = "x";

// Ustawienia
const city_coord = "Warsaw";


async function loadLocalization() {
    const localizaiton = document.getElementById("cityLocalization");

    try {
        const url =
            `https://api.openweathermap.org/geo/1.0/direct?q=${city_coord}&limit=5&appid=${API_KEY}`;
        const res = await fetch(url);
        const data = await res.json();

        console.log("geo data:", data); // żebyś widział, co przychodzi

        // TU BYŁ KILLER:
        if (!Array.isArray(data) || data.length === 0) {
            if (localizaiton){
                localizaiton.innerHTML = "Localization not found";
            }
            return null;
        }

        const first = data[0]; // city name, lat, lon, country, post code

        if (localizaiton) {
            localizaiton.innerHTML =
                `${first.name}, ${first.country}, (${first.lat.toFixed(2)}, ${first.lon.toFixed(2)})`;
        }

        return first;

    } catch (err) {
        console.error(err);
        if (localizaiton) {
            localizaiton.innerHTML = "Błąd połączenia z API.";
        }
        return null;
    }
}




loadLocalization().then(coords => {
    if (!coords) return; // jak null, to nie lecimy dalej
    loadWeather(coords.lat, coords.lon);
});


function kelvinToCelsius(k) {
    return Math.round((k - 273.15) * 10) / 10;
}

async function loadWeather(lat,lon) {
    const widget = document.getElementById("weather-widget");

    try {
        const url =
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`
                
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

loadLocalization();
loadWeather();
