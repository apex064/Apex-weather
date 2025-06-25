const apiKey = "4d8081e53623433a822115507252506";

async function getWeather() {
  const city = document.getElementById("cityInput").value.trim();
  if (!city) return alert("Please enter a city name");

  try {
    const res = await fetch(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`);
    const data = await res.json();

    const { temp_c, feelslike_c, humidity, wind_kph, condition, is_day } = data.current;
    const locationName = data.location.name;

    // Set weather details
    document.getElementById("temp").textContent = `${Math.round(temp_c)}°`;
    document.getElementById("condition").textContent = condition.text;
    document.getElementById("location").textContent = locationName;
    document.getElementById("humidity").textContent = `${humidity}%`;
    document.getElementById("feels").textContent = `${Math.round(feelslike_c)}°`;
    document.getElementById("wind").textContent = `${wind_kph} km/h`;

    // FIXED: Properly set the weather icon
    document.getElementById("weatherIcon").src = `https:${condition.icon}`;

    // Change background based on condition
    setBackground(condition.text.toLowerCase(), is_day);

    // Load hourly forecast
    loadForecast(city);

  } catch (error) {
    console.error("Error fetching weather:", error);
    alert("City not found or API error.");
  }
}

function setBackground(condition, isDay) {
  const bg = document.getElementById("background");
  bg.className = "background"; // Reset previous classes

  if (!isDay) {
    bg.classList.add("night-bg");
  } else if (condition.includes("sunny") || condition.includes("clear")) {
    bg.classList.add("sunny-bg");
  } else if (condition.includes("cloud")) {
    bg.classList.add("cloudy-bg");
  } else if (condition.includes("rain") || condition.includes("drizzle") || condition.includes("shower")) {
    bg.classList.add("rainy-bg");
  } else if (condition.includes("snow") || condition.includes("ice")) {
    bg.classList.add("snowy-bg");
  } else if (condition.includes("mist") || condition.includes("fog") || condition.includes("haze")) {
    bg.classList.add("mist-bg");
  } else {
    bg.classList.add("default-bg");
  }
}

async function loadForecast(city) {
  try {
    const res = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=1`);
    const data = await res.json();
    const forecastHours = data.forecast.forecastday[0].hour;

    const forecastContainer = document.getElementById("forecast");
    forecastContainer.innerHTML = "";

    for (let i = 0; i < 6; i++) {
      const hourData = forecastHours[i * 3];
      const time = new Date(hourData.time).getHours();
      const icon = hourData.condition.icon;
      const temp = Math.round(hourData.temp_c);

      const card = document.createElement("div");
      card.className = "forecast-card";
      card.innerHTML = `
        <p>${formatHour(time)}</p>
        <img src="https:${icon}" alt="forecast icon" />
        <p>${temp}°</p>
      `;
      forecastContainer.appendChild(card);
    }

  } catch (err) {
    console.error("Forecast load failed:", err);
  }
}

function formatHour(hour) {
  if (hour === 0) return "12AM";
  if (hour < 12) return `${hour}AM`;
  if (hour === 12) return "12PM";
  return `${hour - 12}PM`;
}
