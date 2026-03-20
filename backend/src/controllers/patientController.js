const Patient = require("../models/Patient");

// create patient
const createPatient = async (req, res) => {
  try {
    const patient = await Patient.create(req.body);
    res.status(201).json(patient);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// get all patients (useful for testing)
const getPatients = async (req, res) => {
  try {
    const patients = await Patient.find().select("-createdAt -updatedAt -__v ");
    res.json(patients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createPatient, getPatients };