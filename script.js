// ✅ Replace this with your real OpenWeatherMap API key
const API_KEY = 'b19425888a0d18776ad8ded5d260bd2a';

const weatherDisplay = document.getElementById('weatherDisplay');

// Triggered when user clicks "Search" by city
function getWeatherByCity() {
  const city = document.getElementById('cityInput').value.trim();
  if (!city) {
    showError('Please enter a city name.');
    return;
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;
  fetchWeather(url);
}

// Triggered when user clicks "My Location"
function getWeatherByLocation() {
  if (!navigator.geolocation) {
    showError('Geolocation is not supported by your browser.');
    return;
  }

  navigator.geolocation.getCurrentPosition(
    position => {
      const { latitude, longitude } = position.coords;
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`;
      fetchWeather(url);
    },
    error => {
      showError('Unable to get your location.');
    }
  );
}

// Fetch weather data from OpenWeatherMap API
function fetchWeather(url) {
  showLoading();

  fetch(url)
    .then(response => {
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Invalid API Key. Please check your key.');
        } else if (response.status === 404) {
          throw new Error('City not found.');
        } else {
          throw new Error('An error occurred while fetching weather data.');
        }
      }
      return response.json();
    })
    .then(data => displayWeather(data))
    .catch(error => showError(error.message));
}

// Display weather data on the page
function displayWeather(data) {
  const { name, sys, main, weather } = data;
  const icon = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;

  weatherDisplay.innerHTML = `
    <h2>${name}, ${sys.country}</h2>
    <img src="${icon}" alt="${weather[0].description}" />
    <p><strong>${weather[0].main}</strong> – ${capitalize(weather[0].description)}</p>
    <p>🌡 Temperature: ${main.temp}°C</p>
    <p>💧 Humidity: ${main.humidity}%</p>
    <p>📈 Pressure: ${main.pressure} hPa</p>
  `;
}

// Show loading message
function showLoading() {
  weatherDisplay.innerHTML = `<p>Loading weather data...</p>`;
}

// Show error message
function showError(message) {
  weatherDisplay.innerHTML = `<p style="color: red;">❌ ${message}</p>`;
}

// Capitalize first letter of weather description
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}


