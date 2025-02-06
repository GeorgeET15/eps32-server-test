const dataDisplay = document.getElementById("dataDisplay");
const loadingMessage = document.getElementById("loadingMessage");
const errorMessage = document.getElementById("errorMessage");

async function fetchData() {
  loadingMessage.style.display = "block";
  dataDisplay.style.display = "none";
  errorMessage.style.display = "none";

  try {
    const response = await fetch("http://localhost:8000/api/get-data", {
      cache: "no-cache",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    const data = await response.json();
    displayData(data);
  } catch (error) {
    showError(error.message);
  } finally {
    loadingMessage.style.display = "none";
  }
}

function displayData(data) {
  dataDisplay.style.display = "grid";

  document.getElementById(
    "temperature"
  ).textContent = `Temperature: ${data.temperature} °C`;
  document.getElementById(
    "humidity"
  ).textContent = `Humidity: ${data.humidity} %`;
  document.getElementById(
    "accelerationX"
  ).textContent = `Acceleration X: ${data.acceleration_x} m/s²`;
  document.getElementById(
    "accelerationY"
  ).textContent = `Acceleration Y: ${data.acceleration_y} m/s²`;
  document.getElementById(
    "accelerationZ"
  ).textContent = `Acceleration Z: ${data.acceleration_z} m/s²`;
  document.getElementById("gyroX").textContent = `Gyro X: ${data.gyro_x} rad/s`;
  document.getElementById("gyroY").textContent = `Gyro Y: ${data.gyro_y} rad/s`;
  document.getElementById("gyroZ").textContent = `Gyro Z: ${data.gyro_z} rad/s`;
  document.getElementById("timestamp").textContent = `Timestamp: ${new Date(
    data.timestamp
  ).toLocaleString()}`;
}

function showError(message) {
  errorMessage.style.display = "block";
  errorMessage.textContent = message;
}

fetchData();

setInterval(fetchData, 5000);
