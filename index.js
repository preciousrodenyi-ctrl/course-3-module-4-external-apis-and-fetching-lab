const input = document.getElementById("state-input");
const button = document.getElementById("fetch-alerts");
const results = document.getElementById("alerts-display");
const errorDiv = document.getElementById("error-message");

async function fetchWeatherAlerts(state) {
  try {
    hideError();

    const response = await fetch(
      `https://api.weather.gov/alerts/active?area=${state}`
    );

    if (!response.ok) {
      throw new Error("Network failure");
    }

    const data = await response.json();

    displayAlerts(data);

  } catch (error) {
    displayError(error.message);
  }
}

function displayAlerts(data) {
  const alerts = data.features || [];

  results.innerHTML = "";

  const title = document.createElement("h3");
  title.textContent = `Weather Alerts: ${alerts.length}`;
  results.appendChild(title);

  const list = document.createElement("ul");

  alerts.forEach(alert => {
    const li = document.createElement("li");
    li.textContent = alert?.properties?.headline || "No headline";
    list.appendChild(li);
  });

  results.appendChild(list);

  input.value = "";
  hideError();
}

function displayError(message) {
  results.innerHTML = "";

  errorDiv.textContent = message;
  errorDiv.classList.remove("hidden");

  input.value = "";
}

function hideError() {
  errorDiv.textContent = "";
  errorDiv.classList.add("hidden");
}

button.addEventListener("click", () => {
  const state = input.value.trim().toUpperCase();

  if (state.length !== 2) {
    displayError("Please enter a valid 2-letter state code.");
    return;
  }

  fetchWeatherAlerts(state);
});