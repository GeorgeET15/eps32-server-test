const PORT = process.env.PORT || 8000;
const express = require("express");
const { MongoClient } = require("mongodb");
require("dotenv").config();
const API_KEY = process.env.API_KEY;
const app = express();
const cors = require("cors");

const corsOptions = {
  origin: "*",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"],
};
app.use(cors(corsOptions));

app.use(express.json());

const client = new MongoClient(API_KEY, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let db;

async function connectToDB() {
  try {
    if (!client.topology || !client.topology.isConnected()) {
      await client.connect();
    }
    db = client.db("app-data");

    const collections = await db
      .listCollections({ name: "esp32-data" })
      .toArray();
    if (collections.length === 0) {
      await db.createCollection("esp32-data");
      console.log("Collection 'esp32-data' created");
    } else {
      console.log("Collection 'esp32-data' already exists");
    }

    console.log("Connected to MongoDB successfully");
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err);
    process.exit(1);
  }
}

app.get("/", (req, res) => {
  res.json("Even Dead I'm the Hero");
});

app.post("/api/data", async (req, res) => {
  try {
    const {
      temperature,
      humidity,
      acceleration_x,
      acceleration_y,
      acceleration_z,
      gyro_x,
      gyro_y,
      gyro_z,
      deviceId,
    } = req.body;

    if (
      !temperature ||
      !humidity ||
      !acceleration_x ||
      !acceleration_y ||
      !acceleration_z ||
      !gyro_x ||
      !gyro_y ||
      !gyro_z ||
      !deviceId
    ) {
      return res.status(400).json({
        error:
          "Invalid data received. All fields (temperature, humidity, acceleration, gyro, deviceId) are required.",
      });
    }

    const data = {
      temperature,
      humidity,
      acceleration_x,
      acceleration_y,
      acceleration_z,
      gyro_x,
      gyro_y,
      gyro_z,
      timestamp: new Date(),
    };

    const result = await db
      .collection("esp32-data")
      .updateOne({ deviceId }, { $set: data }, { upsert: true });

    if (result.matchedCount > 0) {
      res
        .status(200)
        .json({ success: true, message: "Data updated successfully" });
    } else {
      res.status(200).json({
        success: true,
        message: "New document inserted for device " + deviceId,
      });
    }
  } catch (error) {
    console.error("Error updating data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/get-data", async (req, res) => {
  const deviceId = 1;

  try {
    const data = await db.collection("esp32-data").findOne({ deviceId });

    if (!data) {
      return res
        .status(404)
        .json({ error: "Data not found for deviceId " + deviceId });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, async () => {
  if (!process.env.API_KEY) {
    console.error("MongoDB API_KEY is not defined");
    process.exit(1);
  }
  await connectToDB();
  console.log(`Server running on PORT ${PORT}`);
});
