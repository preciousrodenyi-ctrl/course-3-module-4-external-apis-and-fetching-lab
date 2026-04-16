const input = document.getElementById("state-input");
const button = document.getElementById("fetch-alerts");
const results = document.getElementById("alerts-display");
const errorDiv = document.getElementById("error-message");

// Click event
button.addEventListener("click", () => {
  const state = input.value.trim().toUpperCase();

  // validate input
  if (!state || state.length !== 2) {
    displayError("Please enter a valid 2-letter state code.");
    return;
  }

  fetchWeatherAlerts(state);
});

// Fetch API data
async function fetchWeatherAlerts(state) {
  try {
    errorDiv.style.display = "none";
    errorDiv.innerText = "";

    results.innerHTML = "Loading...";

    const response = await fetch(
      `https://api.weather.gov/alerts/active?area=${state}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch weather alerts.");
    }

    const data = await response.json();

    displayAlerts(data);

    clearInput();

  } catch (error) {
    displayError(error.message);
  }
}

// Display alerts
function displayAlerts(data) {
  const alerts = data.features || [];

  results.innerHTML = `
    <h3>Current watches, warnings, and advisories: ${alerts.length}</h3>
  `;

  if (alerts.length === 0) {
    results.innerHTML += "<p>No active alerts found.</p>";
    return;
  }

  const list = document.createElement("ul");

  alerts.forEach(alert => {
    const li = document.createElement("li");
    li.textContent = alert.properties.headline;
    list.appendChild(li);
  });

  results.appendChild(list);
}

// Error handler
function displayError(message) {
  errorDiv.style.display = "block";
  errorDiv.innerText = message;
  results.innerHTML = "";
}

// Clear input
function clearInput() {
  input.value = "";
}