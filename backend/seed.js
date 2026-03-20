// seed.js
const mongoose = require('mongoose');
const Patient = require('./src/models/Patient');
const Session = require('./src/models/Session');
const { detectAnomalies } = require('./src/utils/anomaly');
require('dotenv').config();

const MONGO_URI = process.env.connection_string;

const patientsData = [
  { name: 'John Doe', age: 45, gender: 'male', dryWeight: 75.5, unit: 'CLINIC A' },
  { name: 'Jane Smith', age: 52, gender: 'female', dryWeight: 62.0, unit: 'CLINIC A' },
  { name: 'Bob Johnson', age: 38, gender: 'male', dryWeight: 85.0, unit: 'CLINIC B' },
  { name: 'Alice Brown', age: 60, gender: 'female', dryWeight: 70.0, unit: 'CLINIC B' },
  { name: 'Charlie Wilson', age: 70, gender: 'male', dryWeight: 68.5, unit: 'CLINIC C' },
  { name: 'David Miller', age: 55, gender: 'male', dryWeight: 80.0, unit: 'CLINIC C' },
  { name: 'Emma Davis', age: 48, gender: 'female', dryWeight: 65.0, unit: 'CLINIC D' },
  { name: 'Frank Moore', age: 63, gender: 'male', dryWeight: 72.0, unit: 'CLINIC D' },
];

const getDate = (daysOffset = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  d.setHours(8, 0, 0, 0);
  return d;
};

const seed = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    await Patient.deleteMany({});
    await Session.deleteMany({});
    console.log('Cleared old data');

    const createdPatients = await Patient.insertMany(patientsData);
    console.log(`Inserted ${createdPatients.length} patients`);

    const sessions = [];

    for (const patient of createdPatients) {

      // 🔵 Scheduled (today)
      sessions.push({
        patientId: patient._id,
        unit: patient.unit,
        machineId: 'MACH-01',
        preWeight: patient.dryWeight + 2.5,
        preSystolicBP: 130,
        preDiastolicBP: 80,
        status: 'scheduled',
        notes: 'Scheduled session',
        sessionDate: getDate(0),
      });

      // 🟡 In-progress (today)
      sessions.push({
        patientId: patient._id,
        unit: patient.unit,
        machineId: 'MACH-02',
        preWeight: patient.dryWeight + 3.5,
        preSystolicBP: 150,
        preDiastolicBP: 95,
        status: 'in-progress',
        notes: 'Monitoring vitals',
        sessionDate: getDate(0),
      });

      // 🔴 Completed (HIGH BP anomaly)
      let session1 = {
        patientId: patient._id,
        unit: patient.unit,
        machineId: 'MACH-03',
        preWeight: patient.dryWeight + 3.0,
        preSystolicBP: 145,
        preDiastolicBP: 92,
        postWeight: patient.dryWeight + 1.0,
        postSystolicBP: 150,
        postDiastolicBP: 95,
        duration: 240,
        status: 'completed',
        notes: 'High BP observed',
        sessionDate: getDate(-1),
      };
      session1.anomalies = detectAnomalies(session1, patient);
      sessions.push(session1);

      // 🔴 Completed (SHORT SESSION anomaly)
      let session2 = {
        patientId: patient._id,
        unit: patient.unit,
        machineId: 'MACH-04',
        preWeight: patient.dryWeight + 4.0,
        preSystolicBP: 135,
        preDiastolicBP: 85,
        postWeight: patient.dryWeight + 2.5,
        postSystolicBP: 138,
        postDiastolicBP: 88,
        duration: 100, // short
        status: 'completed',
        notes: 'Session ended early',
        sessionDate: getDate(-2),
      };
      session2.anomalies = detectAnomalies(session2, patient);
      sessions.push(session2);

      // 🔴 Completed (LONG SESSION anomaly)
      let session3 = {
        patientId: patient._id,
        unit: patient.unit,
        machineId: 'MACH-05',
        preWeight: patient.dryWeight + 2.0,
        preSystolicBP: 120,
        preDiastolicBP: 80,
        postWeight: patient.dryWeight + 0.5,
        postSystolicBP: 122,
        postDiastolicBP: 82,
        duration: 320, // long
        status: 'completed',
        notes: 'Extended dialysis',
        sessionDate: getDate(-3),
      };
      session3.anomalies = detectAnomalies(session3, patient);
      sessions.push(session3);
    }

    await Session.insertMany(sessions);
    console.log(`Inserted ${sessions.length} sessions`);

    console.log('Seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seed();