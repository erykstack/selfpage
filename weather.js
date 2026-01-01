const API_KEY = "x";

// Ustawienia
let city_coord = "Warsaw";


async function loadLocalization() {
    const localizaiton = document.getElementById("cityLocalization");   //Setting the data according to city coordinates 

    try {
        const url =
            `https://api.openweathermap.org/geo/1.0/direct?q=${city_coord}&limit=5&appid=${API_KEY}`;
        const res = await fetch(url);
        const data = await res.json();

        console.log("geo data:", data); // żebyś widział, co przychodzi

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




loadLocalization().then(coords => { //if the API is available we get the data to loadWeather
    if (!coords) return; // 
    loadWeather(coords.lat, coords.lon);
});


function kelvinToCelsius(k) { //changing temperatrue from Kelvin to Celcius
    return Math.round((k - 273.15) * 10) / 10;
}


async function loadWeather(lat,lon) {   // downloading API and waiting for data input
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
        widget.innerHTML = "API connection fail.";
    }
}

/*--- Name city input*/

const cityInput = document.getElementById("city__input");
const citySaveBtn = document.getElementById("city__save");

const savedCity = localStorage.getItem("lastCity");
if(savedCity){
    city_coord = savedCity;
    cityInput.value = savedCity;
    loadLocalization().then(coords => {
        if(!coords) return;
        loadWeather(coords.lat, coords.lon);
    });
}else {
    loadLocalization().then(coords => {
        if(!coords) return;
        loadWeather(coords.lat, coords.lon);
    });
}

citySaveBtn.addEventListener("click", () => { //For searching on the button click
    const value = cityInput.value.trim();
    if(!value) return;
    
    city_coord = value; 
    localStorage.setItem("lastsCity", value);

    loadLocalization().then(coords => {
        if(!coords) return;
        loadWeather(coords.lat, coords.lon);
    });
});

cityInput?.addEventListener("keydown", (e) => { //For searching within Enter click
    if(e.key === "Enter"){
        citySaveBtn?.click();
    }
});


/*--- Selecting from dropdown list---*/

const citySelect = document.getElementById("city-select");

if(citySelect){
    citySelect.addEventListener("change", () => {
        const value = citySelect.value;
        if(!value) return;

        city_coord = value;

        loadLocalization().then(coords => {
            if(!coords) return;
            loadWeather(coords.lat, coords.lon)
        });
    });
}





/*---Creating the HTML elements---*/

function renderWeather(data) {
    const widget = document.getElementById("weather-widget"); 

    const temp = kelvinToCelsius(data.main.temp);   //data from Kelvin to Celcius
    const feels = kelvinToCelsius(data.main.feels_like);
    const desc = data.weather[0].description;
    const city = data.name;
    const country = data.sys.country;

    const humidity = data.main.humidity;
    const wind = data.wind.speed;

    const iconCode = data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`; //downloading the icon from openweather

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


