const express = require("express");
const PatientRouter = express.Router();

const {
  createPatient,
  getPatients,
} = require("../controllers/patientController");

PatientRouter.post("/", createPatient);
PatientRouter.get("/", getPatients);

module.exports = PatientRouter;