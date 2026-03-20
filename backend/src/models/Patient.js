const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Patient name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
    },
    age: {
      type: Number,
      required: [true, "Age is required"],
      min: [0, "Age cannot be negative"],
      max: [120, "Age cannot exceed 120"],
    },
    gender: {
      type: String,
      enum: {
        values: ["male", "female", "other"],
        message: "Gender must be male, female, or other",
      },
      required: [true, "Gender is required"],
    },
    dryWeight: {
      type: Number,
      required: [true, "Dry weight is required"],
      min: [1, "Dry weight must be realistic"],
    },
    unit: {
      type: String,
      required: [true, "Unit is required"],
      trim: true,
      uppercase: true, // keeps consistent (e.g., CLINIC A)
    },
  },
  { timestamps: true }
);

// index for fast queries by unit
patientSchema.index({ unit: 1 });

module.exports = mongoose.model("Patient", patientSchema);