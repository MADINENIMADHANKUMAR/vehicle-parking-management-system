const Vehicle = require("./models/Vehicle");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Vehicle Parking Management System API is running"
  });
});

app.post("/api/vehicles", async (req, res) => {
  try {
    const vehicle = await Vehicle.create(req.body);
    res.status(201).json({
      message: "Vehicle registered successfully",
      vehicle
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Vehicle ID or registration number already exists"
      });
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: error.message
      });
    }

    res.status(500).json({
      message: "Failed to register vehicle"
    });
  }
});

app.get("/api/vehicles", async (req, res) => {
  try {
    const vehicles = await Vehicle.find().sort({ createdAt: -1 });

    res.status(200).json(vehicles);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch vehicles"
    });
  }
});

app.put("/api/vehicles/:id", async (req, res) => {
  try {
    const vehicle = await Vehicle.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!vehicle) {
      return res.status(404).json({
        message: "Vehicle not found"
      });
    }

    res.status(200).json({
      message: "Vehicle updated successfully",
      vehicle
    });
  } catch (error) {
    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid vehicle ID or vehicle details"
      });
    }

    if (error.code === 11000) {
      return res.status(409).json({
        message: "Vehicle ID or registration number already exists"
      });
    }

    res.status(500).json({
      message: "Failed to update vehicle"
    });
  }
});

app.delete("/api/vehicles/:id", async (req, res) => {
  try {
    const vehicle = await Vehicle.findByIdAndDelete(req.params.id);

    if (!vehicle) {
      return res.status(404).json({
        message: "Vehicle not found"
      });
    }

    res.status(200).json({
      message: "Vehicle deleted successfully",
      vehicle
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid vehicle ID"
      });
    }

    res.status(500).json({
      message: "Failed to delete vehicle"
    });
  }
});

app.post("/api/parking/calculate", (req, res) => {
  const { vehicleType, hours } = req.body;

  const rates = {
    Bike: 10,
    Car: 20,
    Truck: 40,
    Bus: 50,
    Other: 15
  };

  if (!Object.hasOwn(rates, vehicleType)) {
    return res.status(400).json({
      message: "Invalid vehicle type"
    });
  }

  if (
    hours === undefined ||
    hours === null ||
    hours === "" ||
    !Number.isFinite(Number(hours)) ||
    Number(hours) <= 0
  ) {
    return res.status(400).json({
      message: "Parking hours must be a positive number"
    });
  }

  const totalCharge = rates[vehicleType] * Number(hours);

  res.status(200).json({
    vehicleType,
    hours: Number(hours),
    ratePerHour: rates[vehicleType],
    totalCharge
  });
});


mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected successfully");

    app.listen(process.env.PORT, () => {
      console.log(
        `Server running on http://localhost:${process.env.PORT}`
      );
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  });