const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: [true, "Patient ID is required"],
    },
    unit: {
      type: String,
      required: [true, "Unit is required"],
      uppercase: true,
      trim: true,
      index: true,
    },
    // Pre-dialysis vitals – always required
    preWeight: {
      type: Number,
      required: [true, "Pre-dialysis weight is required"],
      min: [0, "Pre-weight must be realistic"],
    },
    preSystolicBP: {
      type: Number,
      required: [true, "Pre-dialysis systolic BP is required"],
    },
    preDiastolicBP: {
      type: Number,
      required: [true, "Pre-dialysis diastolic BP is required"],
    },
    // Post-dialysis vitals – now optional (will be filled later)
    postWeight: {
      type: Number,
      min: [0, "Post-weight must be realistic"],
      
    },
    postSystolicBP: {
      type: Number,
    
    },
    postDiastolicBP: {
      type: Number,
      
    },
    duration: {
      type: Number, // in minutes
      min: [0, "Duration cannot be negative"],

    },
    machineId: {
      type: String,
      required: [true, "Machine ID is required"],
      trim: true,
    },
    notes: {
      type: String,
      maxlength: [300, "Notes too long"],
      default: "",
    },
    status: {
      type: String,
      enum: ["scheduled", "in-progress", "completed"],
      default: "scheduled",
      required: true,
    },
    anomalies: {
      type: [String],
      default: [],
    },
    sessionDate: {
      type: Date,
      required: true,
      default: Date.now,
      index: true,
    },
  },
  { timestamps: true }
);

sessionSchema.index({ unit: 1, sessionDate: 1 });

module.exports = mongoose.model("Session", sessionSchema);