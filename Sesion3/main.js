const API_KEY = '22ea2b3631e21d843c5cf6ef687ba5b2';

async function getWeather(city) {
    const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city},ES&appid=${API_KEY}&units=metric&lang=es`
    );
    return await response.json();
}

function showWeather(data) {
    document.getElementById('city').textContent = data.name;
    document.getElementById('temp').textContent = `${Math.round(data.main.temp)}°C`;
    document.getElementById('desc').textContent = data.weather[0].description;
    document.getElementById('weather-icon').src =
        `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
}

document.getElementById('search-btn').addEventListener('click', async () => {
    const city = document.getElementById('city-input').value;
    const data = await getWeather(city);
    showWeather(data);
});


getWeather('Tomelloso').then(showWeather);