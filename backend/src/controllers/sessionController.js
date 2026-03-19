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
    console.log("REQ BODY:", req.body);
    const { patientId } = req.body;

    // 1. Verify patient exists and get their unit + dryWeight
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }
    const existingSession = await Session.findOne({
          patientId: patientId,
      status: { $in: ['scheduled', 'in-progress'] }
});

if (existingSession) {
  return res.status(409).json({ 
    error: "Patient already has an active session. Please complete it before starting a new one." 
  });
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
const getTodaysSessions = async (req, res) => {
  try {
    const { date, unit } = req.query;
    const targetDate = date ? new Date(date) : new Date();
    
    // Start and end of the day (UTC)
    const start = new Date(targetDate);
    start.setUTCHours(0, 0, 0, 0);
    const end = new Date(targetDate);
    end.setUTCHours(23, 59, 59, 999);

    // Build query: sessions within the target date range, optionally filtered by unit
    const query = { sessionDate: { $gte: start, $lte: end } };
    if (unit) query.unit = unit;

    const sessions = await Session.find(query).lean();

    // If no sessions, return empty array early
    if (sessions.length === 0) {
      return res.json([]);
    }

    // Get unique patient IDs
    const patientIds = [...new Set(sessions.map(s => s.patientId.toString()))];
    const patients = await Patient.find({ _id: { $in: patientIds } }).lean();
    const patientMap = Object.fromEntries(patients.map(p => [p._id.toString(), p]));

    // Enrich each session with patient details
const enriched = sessions.map(session => {
  const patient = patientMap[session.patientId.toString()];

  return {
    patientName: patient?.name || "Unknown",
    status: session.status,
    preWeight: session.preWeight,
    postWeight: session.postWeight || null,
    preBP: `${session.preSystolicBP}/${session.preDiastolicBP}`,
    postBP: session.postSystolicBP
      ? `${session.postSystolicBP}/${session.postDiastolicBP}`
      : null,
    duration: session.duration || null,
    anomalies: session.anomalies
  };
});

    res.json(enriched);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



module.exports = { createSession ,completeSession, getTodaysSessions};