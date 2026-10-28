
const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema(
  {
    vehicleId: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    registrationNumber: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true
    },
    ownerName: {
      type: String,
      required: true,
      trim: true
    },
    vehicleType: {
      type: String,
      required: true,
      enum: ["Bike", "Car", "Truck", "Bus", "Other"]
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Vehicle", vehicleSchema);
