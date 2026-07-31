const apiKey = '0a78f74ab07846423e30e59653f36db5';
const form = document.querySelector('#weather-form');
const input = document.querySelector('#city-input');
const weatherContent = document.querySelector('#weather-content');
const loader = document.querySelector('#weather-loader');
const forecastGrid = document.querySelector('#forecast-grid');
const bgFx = document.querySelector('#weather-bg-fx');
let tempChartInstance = null;

// Farmer Wisdom Mapping
const getFarmerAdvice = (temp, humidity, main, desc) => {
    if (main.includes('Rain')) return "🚜 Heavy rain expected. Avoid pesticide spraying and ensure proper drainage in your fields.";
    if (temp > 35) return "☀️ Extreme heat! Increase irrigation frequency and watch for heat-stressed crops.";
    if (humidity > 80) return "💧 High humidity detected. High risk of fungal diseases; inspect your crops closely.";
    if (temp < 10) return "❄️ Near-frost conditions. Cover sensitive crops and use mulch to retain soil warmth.";
    if (main.includes('Clear')) return "🌾 Clear skies. Ideal for harvesting, sowing, or applying fertilizers.";
    if (main.includes('Clouds')) return "☁️ Overcast. Good for land preparation as evaporation rates are low.";
    return "🌱 Conditions are generally stable for most farming activities.";
};

// Update Background Effects
const updateBgEffects = (main) => {
    bgFx.className = 'weather-bg-fx';
    if (main.includes('Rain')) bgFx.classList.add('rain-drops');
    // Add more effects if needed
};

const fetchWeather = async (city, lat, lon) => {
    loader.classList.remove('hidden');
    weatherContent.classList.add('hidden');

    try {
        let url = `https://api.openweathermap.org/data/2.5/weather?units=metric&appid=${apiKey}`;
        let forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?units=metric&appid=${apiKey}`;
        
        if (city) {
            url += `&q=${city}`;
            forecastUrl += `&q=${city}`;
        } else {
            url += `&lat=${lat}&lon=${lon}`;
            forecastUrl += `&lat=${lat}&lon=${lon}`;
        }

        const [currRes, foreRes] = await Promise.all([fetch(url), fetch(forecastUrl)]);
        const currData = await currRes.json();
        const foreData = await foreRes.json();

        if (currData.cod !== 200) throw new Error('City not found');

        displayCurrentWeather(currData);
        displayForecast(foreData);

        loader.classList.add('hidden');
        weatherContent.classList.remove('hidden');
    } catch (error) {
        alert(error.message);
        loader.classList.add('hidden');
    }
};

const displayCurrentWeather = (data) => {
    document.querySelector('#display-city').textContent = data.name + ", " + data.sys.country;
    document.querySelector('#current-temp').textContent = Math.round(data.main.temp);
    document.querySelector('#weather-desc').textContent = data.weather[0].description;
    
    // Detailed stats
    document.querySelector('#humidity-val').textContent = data.main.humidity + "%";
    document.querySelector('#wind-val').textContent = Math.round(data.wind.speed * 3.6) + " km/h"; // Convert m/s to km/h
    document.querySelector('#pressure-val').textContent = data.main.pressure + " hPa";
    document.querySelector('#visibility-val').textContent = (data.visibility / 1000).toFixed(1) + " km";

    // Icon
    const icon = data.weather[0].icon;
    document.querySelector('#main-weather-icon').src = `https://openweathermap.org/img/wn/${icon}@4x.png`;

    // Premium Stats
    document.querySelector('#feels-like').textContent = `Feels like ${Math.round(data.main.feels_like)}°`;

    const formatTime = (unixTime) => {
        const d = new Date(unixTime * 1000);
        return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    document.querySelector('#sunrise-val').textContent = formatTime(data.sys.sunrise);
    document.querySelector('#sunset-val').textContent = formatTime(data.sys.sunset);

    // Farmer Advice
    document.querySelector('#farmer-advice').textContent = getFarmerAdvice(
        data.main.temp, 
        data.main.humidity, 
        data.weather[0].main, 
        data.weather[0].description
    );

    // BG Effects
    updateBgEffects(data.weather[0].main);

    // Date
    const now = new Date();
    const options = { weekday: 'long', day: 'numeric', month: 'long' };
    document.querySelector('#current-date').textContent = now.toLocaleDateString('en-US', options);
};

const displayForecast = (data) => {
    forecastGrid.innerHTML = '';
    // Filter to get 1 forecast per day (around noon)
    const dailyForecasts = data.list.filter(item => item.dt_txt.includes('12:00:00'));

    const labels = [];
    const temps = [];

    dailyForecasts.forEach(day => {
        const date = new Date(day.dt_txt);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        const temp = Math.round(day.main.temp);
        const desc = day.weather[0].description;
        const icon = day.weather[0].icon;

        labels.push(dayName);
        temps.push(temp);

        const card = document.createElement('div');
        card.className = 'forecast-card-modern';
        card.innerHTML = `
            <span class="f-day">${dayName}</span>
            <img class="f-icon" src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${desc}">
            <span class="f-temp">${temp}°C</span>
            <span class="f-desc">${desc}</span>
        `;
        forecastGrid.appendChild(card);
    });

    renderChart(labels, temps);
};

const renderChart = (labels, data) => {
    const ctx = document.getElementById('tempChart').getContext('2d');
    
    if (tempChartInstance) {
        tempChartInstance.destroy();
    }

    tempChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Temperature (°C) Trend',
                data: data,
                borderColor: '#2ecc71',
                backgroundColor: 'rgba(46, 204, 113, 0.2)',
                borderWidth: 3,
                tension: 0.4,
                fill: true,
                pointBackgroundColor: '#fff',
                pointBorderColor: '#2ecc71',
                pointRadius: 5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { labels: { color: '#333' } }
            },
            scales: {
                x: {
                    ticks: { color: '#555' },
                    grid: { color: 'rgba(0,0,0,0.05)' }
                },
                y: {
                    ticks: { color: '#555' },
                    grid: { color: 'rgba(0,0,0,0.05)' }
                }
            }
        }
    });
};


form.addEventListener('submit', (e) => {
    e.preventDefault();
    const city = input.value.trim();
    if (city) fetchWeather(city);
});

// Initial Location Check
window.addEventListener('load', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (pos) => fetchWeather(null, pos.coords.latitude, pos.coords.longitude),
            () => fetchWeather('Mumbai') // Default fallback
        );
    } else {
        fetchWeather('Mumbai');
    }
});