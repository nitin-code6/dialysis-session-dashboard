// seed.js
const mongoose = require('mongoose');
const Patient = require('./src/models/Patient');
const Session = require('./src/models/Session');
const { detectAnomalies } = require('./src/utils/anomaly');
require('dotenv').config();

const MONGO_URI = process.env.connection_string;

// Sample patients
const patientsData = [
  { name: 'John Doe', age: 45, gender: 'male', dryWeight: 75.5, unit: 'CLINIC A' },
  { name: 'Jane Smith', age: 52, gender: 'female', dryWeight: 62.0, unit: 'CLINIC A' },
  { name: 'Bob Johnson', age: 38, gender: 'male', dryWeight: 85.0, unit: 'CLINIC B' },
  { name: 'Alice Brown', age: 60, gender: 'female', dryWeight: 70.0, unit: 'CLINIC B' },
  { name: 'Charlie Wilson', age: 70, gender: 'male', dryWeight: 68.5, unit: 'CLINIC C' },
];

// Helper to create a date relative to today (e.g., today, yesterday, etc.)
const getDate = (daysOffset = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  d.setHours(8, 0, 0, 0); // set to 8 AM local time
  return d;
};

const seed = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Patient.deleteMany({});
    await Session.deleteMany({});
    console.log('Cleared old data');

    // Insert patients
    const createdPatients = await Patient.insertMany(patientsData);
    console.log(`Inserted ${createdPatients.length} patients`);

    // Build sessions
    const sessions = [];

    for (const patient of createdPatients) {
      // Today's scheduled session (not started)
      sessions.push({
        patientId: patient._id,
        unit: patient.unit,
        machineId: 'MACH-01',
        preWeight: patient.dryWeight + 2.5,
        preSystolicBP: 130,
        preDiastolicBP: 80,
        status: 'scheduled',
        notes: 'Regular check',
        sessionDate: getDate(0), // today
      });

      // One in-progress session for a specific patient
      if (patient.name === 'John Doe') {
        sessions.push({
          patientId: patient._id,
          unit: patient.unit,
          machineId: 'MACH-02',
          preWeight: patient.dryWeight + 3.2,
          preSystolicBP: 145,
          preDiastolicBP: 95,
          status: 'in-progress',
          notes: 'Patient feeling well',
          sessionDate: getDate(0), // today
        });
      }

      // Completed sessions with anomalies
      if (patient.unit === 'CLINIC B') {
        const session = {
          patientId: patient._id,
          unit: patient.unit,
          machineId: 'MACH-03',
          preWeight: patient.dryWeight + 4.0,
          preSystolicBP: 140,
          preDiastolicBP: 90,
          postWeight: patient.dryWeight + 1.5,
          postSystolicBP: 150,
          postDiastolicBP: 95,
          duration: 110,
          status: 'completed',
          notes: 'Patient left early',
          sessionDate: getDate(-1), // yesterday
        };
        session.anomalies = detectAnomalies(session, patient);
        sessions.push(session);
      }

      if (patient.unit === 'CLINIC C') {
        const session = {
          patientId: patient._id,
          unit: patient.unit,
          machineId: 'MACH-04',
          preWeight: patient.dryWeight + 2.0,
          preSystolicBP: 125,
          preDiastolicBP: 80,
          postWeight: patient.dryWeight + 0.5,
          postSystolicBP: 128,
          postDiastolicBP: 82,
          duration: 320,
          status: 'completed',
          notes: 'Equipment calibration took time',
          sessionDate: getDate(-2), // two days ago
        };
        session.anomalies = detectAnomalies(session, patient);
        sessions.push(session);
      }
    }

    // Insert all sessions
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