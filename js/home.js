// Update footer dates
document.getElementById("year").textContent = new Date().getFullYear();
document.getElementById("lastModified").textContent = document.lastModified;

// Menu toggle
document.getElementById("menuToggle").addEventListener("click", () => {
  const navList = document.querySelector("#navMenu ul");
  navList.classList.toggle("show");
});

// ------------------
// 1. Weather Section
// ------------------
const apiKey = "ef6e615e66dffbfad631b48406e8362e";
const city = "Sandy";
const units = "imperial";

// Fetch current weather + forecast
async function fetchWeather() {
  try {
    const currentWeatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${units}&appid=${apiKey}`;
    const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=${units}&appid=${apiKey}`;

    const [currentRes, forecastRes] = await Promise.all([
      fetch(currentWeatherURL),
      fetch(forecastURL),
    ]);

    const currentData = await currentRes.json();
    const forecastData = await forecastRes.json();

    if (currentRes.status !== 200 || forecastRes.status !== 200) {
      throw new Error("API key inactive or data unavailable");
    }

    showCurrentWeather(currentData);
    showForecast(forecastData);
  } catch (error) {
    console.warn("API Error:", error);
  }
}

// Show current weather
function showCurrentWeather(data) {
  const weatherSection = document.querySelector("#weather-info");
  const iconImg = document.querySelector("#weather-icon");

  const icon = data.weather[0].icon;
  const description = data.weather[0].description;
  const temp = data.main.temp;

  weatherSection.innerHTML = `
    <p><strong>${Math.round(temp)}°F</strong></p>
    <p>${description}</p>
  `;

  iconImg.src = `https://openweathermap.org/img/wn/${icon}@2x.png`;
  iconImg.alt = description;
  iconImg.style.opacity = "1";
}

// Show 3-day forecast
function showForecast(data) {
  const forecastSection = document.querySelector("#forecast");
  forecastSection.innerHTML = "";

  const forecastDays = {};
  for (const item of data.list) {
    const date = new Date(item.dt_txt);
    const day = date.toLocaleDateString("en-US", { weekday: "long" });

    if (date.getHours() === 12 && !forecastDays[day]) {
      forecastDays[day] = true;

      const icon = item.weather[0].icon;
      const description = item.weather[0].description;
      const temp = item.main.temp;

      forecastSection.innerHTML += `
        <div class="forecast-card">
          <h4>${day}</h4>
          <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${description}">
          <p>${Math.round(temp)}°F</p>
        </div>
      `;
    }

    if (Object.keys(forecastDays).length >= 3) break;
  }
}

// ------------------
// 2. Spotlight Section
// ------------------
async function loadSpotlights() {
  try {
    const response = await fetch("data/members.json");
    const members = await response.json();

    const filtered = members.filter(
      (m) => m.membership === "Gold" || m.membership === "Silver"
    );

    const spotlights = shuffle(filtered).slice(0, 3);
    displaySpotlights(spotlights);
  } catch (error) {
    console.error("Error loading spotlights:", error);
  }
}

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

// Display spotlight members
function displaySpotlights(spotlights) {
  const container = document.querySelector("#spotlights");
  container.innerHTML = "";

  spotlights.forEach((member) => {
    const card = document.createElement("div");
    card.classList.add("spotlight-card");
    card.innerHTML = `
        <h3>${member.name}</h3>
        <p class="tagline-spot">${member.membership} Member</p>
        <hr>
        <div class="business-content-spot">
            <div class="logo-wrapper-spot">
                <img src="images/${member.image}" alt="${member.name} Logo">
            </div>
            <div class="business-info-spot">
                <p><span>Email:</span> ${member.email}</p>
                <p><span>Phone:</span> ${member.phone}</p>
                <p><span>Address:</span> ${member.address}</p>
                <p><span>Website:</span> <a href="${member.website}" target="_blank">${member.website}</a></p>        
                <p>${member.other_info}</p>
            </div>
        </div>
    `;
    container.appendChild(card);
  });
}

// ------------------
// Init
// ------------------
fetchWeather();
loadSpotlights();
