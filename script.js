const apiKey = "bd5e378503939ddaee76f12ad7a97608";

// Function to update the UI with weather data
function updateWeatherUI(data) {
    const temp = Math.round(data.main.temp) + "°C";
    const condition = data.weather[0].main;
    const wind = data.wind.speed + " km/h";
    const humidity = data.main.humidity + "%";
    const visibility = (data.visibility / 1000).toFixed(1) + " km";
    const location = `${data.name}, ${data.sys.country}`;

    document.querySelector(".weather-temp").textContent = temp;
    document.querySelector(".weather-condition").textContent = condition;
    document.querySelector(".weather-location").textContent = location;
    
    const highlightBox = document.querySelector(".highlight-box");
    if (highlightBox) {
        highlightBox.innerHTML = `
            <div><strong>Sunrise:</strong> ${new Date(data.sys.sunrise * 1000).toLocaleTimeString()}</div>
            <div><strong>Sunset:</strong> ${new Date(data.sys.sunset * 1000).toLocaleTimeString()}</div>
            <div><strong>Wind:</strong> ${wind}</div>
            <div><strong>UV:</strong> Moderate (4)</div>
            <div><strong>Humidity:</strong> ${humidity}</div>
            <div><strong>Visibility:</strong> ${visibility}</div>
        `;
    }
}

// Function to show loading state
function showLoading(cityName) {
    document.querySelector(".weather-temp").textContent = "Loading...";
    document.querySelector(".weather-condition").textContent = "Fetching...";
    document.querySelector(".weather-location").textContent = cityName;
}

// Function to show error state
function showError(message) {
    document.querySelector(".weather-temp").textContent = "Error";
    document.querySelector(".weather-condition").textContent = message;
    document.querySelector(".weather-location").textContent = "Please try again";
}

// Main weather fetching function
async function fetchWeatherData(cityName) {
    showLoading(cityName);

    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${apiKey}`
        );
        const data = await response.json();

        if (data.cod === 200) {
            updateWeatherUI(data);
        } else {
            showError(data.message || "City not found");
        }
    } catch (error) {
        console.error("Failed to fetch weather data:", error);
        showError("Failed to fetch weather data");
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('location-search');
    const searchButton = document.getElementById('search-button');

    function handleSearch() {
        const location = searchInput.value.trim();
        if (location) {
            fetchWeatherData(location);
            searchInput.value = '';
        }
    }

    if (searchButton) {
        searchButton.addEventListener('click', handleSearch);
    }

    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleSearch();
            }
        });
    }

    // Load initial weather data for Greater Noida
    fetchWeatherData("Greater Noida");
});
