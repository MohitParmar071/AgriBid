const apiKey = '0a78f74ab07846423e30e59653f36db5'; // ← Your valid API key
const form = document.querySelector('#weather-form');
const input = document.querySelector('#city-input');
const forecastGrid = document.querySelector('.forecast-grid');
const headerTitle = document.querySelector('.city-name');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const city = input.value.trim();
  if (!city) return;

  try {
    const res = await fetch(
     ` https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`
    );
    const data = await res.json();

    if (data.cod !== "200") {
      alert('City not found. Try again.');
      return;
    }

    displayWeather(data);
  } catch (error) {
    alert('Error fetching weather data.');
  }
});

function displayWeather(data) {
  forecastGrid.innerHTML = '';
  headerTitle.textContent = `🌾 Weather Forecast for ${data.city.name}`

  const dailyForecasts = data.list.filter((item, index) => index % 8 === 0); // 1 forecast per day

  dailyForecasts.forEach(day => {
    const date = new Date(day.dt_txt);
    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
    const temp = Math.round(day.main.temp);
    const desc = day.weather[0].description;
    const icon = day.weather[0].icon;

    const card = document.createElement('div');
    card.className = 'forecast-card';
    card.innerHTML = `
      <img class="weather-icon" src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${desc}">
      <h4>${dayName}</h4>
      <div class="temp">${temp}°C</div>
      <div class="description">${desc}</div>
    `;
    forecastGrid.appendChild(card);
  });
}