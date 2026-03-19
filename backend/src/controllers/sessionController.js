const Session = require("../models/Session");
const Patient = require("../models/Patient");
const { detectAnomalies } = require("../utils/anomaly");

/**
 * Create a new dialysis session.
 * Request body should contain:
 *   patientId, machineId, preWeight, preSystolicBP, preDiastolicBP
 *   Optional: notes, sessionDate, status (defaults to 'scheduled')
 * 
 * Post-dialysis fields (postWeight, postSystolicBP, postDiastolicBP, duration)
 * are not required at creation – they will be added later via complete endpoint.
 */
const createSession = async (req, res) => {
  try {
    const { patientId } = req.body;

    // 1. Verify patient exists and get their unit + dryWeight
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }

    // 2. Compute anomalies based on available data (pre weight vs dry weight)
    //    detectAnomalies will skip checks that need post data
    const anomalies = detectAnomalies(req.body, patient);

    // 3. Create the session – unit copied from patient, anomalies attached
    const session = await Session.create({
      ...req.body,
      unit: patient.unit,
      anomalies,
      // status defaults to 'scheduled' unless provided
    });

    res.status(201).json(session);
  } catch (error) {
    // Mongoose validation errors (e.g., missing required fields)
    res.status(400).json({ error: error.message });
  }
};
const completeSession = async (req, res) => {
  try {
    const { id } = req.params;
    const { postWeight, postSystolicBP, postDiastolicBP, duration } = req.body;

    // Find the session
    const session = await Session.findById(id);
    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    // Update post vitals and duration
    if (postWeight !== undefined) session.postWeight = postWeight;
    if (postSystolicBP !== undefined) session.postSystolicBP = postSystolicBP;
    if (postDiastolicBP !== undefined) session.postDiastolicBP = postDiastolicBP;
    if (duration !== undefined) session.duration = duration;

    // Mark as completed
    session.status = "completed";

    // Recompute anomalies using the now‑complete session data
    const patient = await Patient.findById(session.patientId);
    if (patient) {
      session.anomalies = detectAnomalies(session, patient);
    }

    await session.save();

    res.json(session);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};



module.exports = { createSession ,completeSession};