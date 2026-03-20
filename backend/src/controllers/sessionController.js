const Session = require("../models/Session");
const Patient = require("../models/Patient");
const { detectAnomalies } = require("../utils/anomaly");

/* Create a new dialysis session (pre‑dialysis data only) */
const createSession = async (req, res) => {
  try {
    const { patientId } = req.body;

    // 1. Verify patient exists
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }

    // 2. Prevent overlapping active sessions (scheduled or in-progress)
    const existingActive = await Session.findOne({
      patientId,
      status: { $in: ["scheduled", "in-progress"] }
    });
    if (existingActive) {
      return res.status(409).json({
        error: "Patient already has an active session. Complete it before starting a new one."
      });
    }

    // 3. Compute anomalies based on pre‑dialysis data
    const anomalies = detectAnomalies(req.body, patient);

    // 4. Create session
    const session = await Session.create({
      ...req.body,
      unit: patient.unit,
      anomalies
    });

    res.status(201).json(session);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/*Start a session (change status from scheduled → in-progress)*/
const startSession = async (req, res) => {
  try {
    const { id } = req.params;
    const session = await Session.findById(id);
    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    if (session.status === "completed") {
      return res.status(400).json({ error: "Cannot start a completed session" });
    }

    session.status = "in-progress";
    await session.save();

    res.json(session);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * Complete a session (add post‑dialysis data, set status to completed)
 * PATCH /api/sessions/:id/complete
 */
const completeSession = async (req, res) => {
  try {
    const { id } = req.params;
    const { postWeight, postSystolicBP, postDiastolicBP, duration } = req.body;

    const session = await Session.findById(id);
    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    // Update only provided fields
    if (postWeight !== undefined) session.postWeight = postWeight;
    if (postSystolicBP !== undefined) session.postSystolicBP = postSystolicBP;
    if (postDiastolicBP !== undefined) session.postDiastolicBP = postDiastolicBP;
    if (duration !== undefined) session.duration = duration;

    session.status = "completed";

    // Recompute anomalies with complete data
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

/**
 * Update nurse notes
 * PATCH /api/sessions/:id/notes
 */
const updateNotes = async (req, res) => {
  try {
    const { id } = req.params;
    const { notes } = req.body;

    const session = await Session.findByIdAndUpdate(
      id,
      { notes },
      { new: true, runValidators: true }
    );

    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    res.json(session);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * Get today's schedule (optionally by unit)
 * GET /api/sessions?date=YYYY-MM-DD&unit=UNIT
 */
const getTodaysSessions = async (req, res) => {
  try {
    const { date, unit } = req.query;
    const targetDate = date ? new Date(date) : new Date();

    // UTC day boundaries
    const start = new Date(targetDate);
    start.setUTCHours(0, 0, 0, 0);
    const end = new Date(targetDate);
    end.setUTCHours(23, 59, 59, 999);

    // Build query
    const query = { sessionDate: { $gte: start, $lte: end } };
    if (unit) {
      query.unit = unit.trim().toUpperCase(); // ✅ FIXED
    }

    const sessions = await Session.find(query).lean();
    if (sessions.length === 0) return res.json([]);

    // Fetch patient details
    const patientIds = [...new Set(sessions.map(s => s.patientId.toString()))];
    const patients = await Patient.find({ _id: { $in: patientIds } }).lean();
    const patientMap = Object.fromEntries(
      patients.map(p => [p._id.toString(), p])
    );

    // Clean response (IMPORTANT)
    const enriched = sessions.map(session => {
      const patient = patientMap[session.patientId.toString()];

      return {
         _id: session._id,
        patientName: patient?.name || "Unknown",
        status: session.status,
        preWeight: session.preWeight,
        postWeight: session.postWeight || null,
        preBP: `${session.preSystolicBP}/${session.preDiastolicBP}`,
        postBP: session.postSystolicBP
          ? `${session.postSystolicBP}/${session.postDiastolicBP}`
          : null,
        duration: session.duration || null,
        anomalies: session.anomalies,
        notes: session.notes,
          machineId: session.machineId

      };
    });

    res.json(enriched);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
module.exports = {
  createSession,
  startSession,
  completeSession,
  updateNotes,
  getTodaysSessions
};