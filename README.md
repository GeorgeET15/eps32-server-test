# ESP32 IoT Sensor Data Collection System

## Overview

This project involves an ESP32 microcontroller collecting sensor data and sending it to a Node.js backend, which stores the data in a MongoDB database. The frontend provides a dashboard to visualize the collected data in real-time.

## Components Used

- **ESP32**: Collects sensor data and transmits it over WiFi.
- **MPU6050**: MPU6050 devices combine a 3-axis gyroscope and a 3-axis accelerometer on the same silicon together with an onboard Digital Motion Processor (DMP).
- **Node.js (Express.js)**: Backend API to receive and store data in MongoDB.
- **MongoDB**: NoSQL database to store sensor data.
- **Frontend (HTML/CSS/JS)**: Displays real-time sensor data in a dashboard.

---

## System Architecture

1. **ESP32 Sensor Data Collection**

   - The ESP32 reads data from connected sensors (e.g., temperature, humidity, etc.).
   - Sends an HTTP POST request with sensor values to the Node.js backend.

2. **Backend (Node.js + Express.js)**

   - Exposes an API endpoint (`/data`) to receive data from ESP32.
   - Stores the received data in MongoDB with timestamps.
   - Provides an API endpoint to retrieve stored sensor data for the frontend.

3. **Database (MongoDB)**

   - Stores sensor readings with timestamps.
   - Allows retrieval of data for analysis and visualization.

4. **Frontend (Dashboard)**
   - Fetches data from the backend using AJAX or Fetch API.
   - Displays data in a user-friendly interface using tables and charts.

---

## Setup Instructions

### 1. ESP32 Firmware Setup

- Install the Arduino IDE and add ESP32 board support [watch this](https://youtu.be/H9e1Up7xHjc?si=OsKaWPXbnJXGdyPZ)
  .
- Install necessary libraries (e.g., WiFi, HTTPClient).
- Upload the provided [code](esp32_test.ino) to the ESP32
  .
- Configure WiFi credentials and backend server URL in the code.

### 2. Backend Setup (Node.js + Express)

- Open a terminal inside the backend folder.
- Run the commands given below.

```bash
# Install dependencies
npm i

# Start the server
npm start
```

### 3. MongoDB Setup

- Create a MongoDB account and create a new database.
- In the backend folder create a .env file.
- Get the API key and replace the one in .env file.

```bash
# copy and paste this inside the .env file

API_KEY = "paste your API key here"
```

### 4. Connecting the components

- GND(esp32) - GND(mpu6050).
- 3v3(esp32) - VCC(mpu6050).
- D21(esp32) - SDA(mpu6050).
- D22(esp32) - SCL(mpu6050).
- SDA :- It is the data line.
- SCL :- It sends the clock signals.

### 5. Frontend Setup

- Open `index.html` in a browser.
- Ensure the backend server is running to fetch and display data.

## API Endpoints

### 1. Receive Sensor Data (POST)

```
api/data
{
  "sensor": "temperature",
  "value": 25.5
}
```

### 2. Retrieve Sensor Data (GET)

```
api/get-data
Response:
[
  { "sensor": "temperature", "value": 25.5, "timestamp": "2024-02-06T12:00:00Z" }
]
```

---
