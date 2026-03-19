const { ANOMALY_THRESHOLDS } = require('../config/constant');

/**
 * Detect anomalies based on the given session and patient.
 * @param {Object} session - Session document (with preWeight, postWeight, postSystolicBP, postDiastolicBP, duration)
 * @param {Object} patient - Patient document (with dryWeight)
 * @returns {Array} - Array of anomaly codes (strings)
 */
function detectAnomalies(session, patient) {
  const anomalies = [];

  // 1. Excess interdialytic weight gain (before dialysis)
  if (session.preWeight && patient.dryWeight) {
    const weightGain = session.preWeight - patient.dryWeight;
    if (weightGain > ANOMALY_THRESHOLDS.EXCESS_WEIGHT_GAIN_KG) {
      anomalies.push('EXCESS_WEIGHT_GAIN');
    }
  }

  // 2. Inadequate fluid removal (after dialysis) – residual above dry weight
  if (session.postWeight && patient.dryWeight) {
    const residualFluid = session.postWeight - patient.dryWeight;
    if (residualFluid > ANOMALY_THRESHOLDS.INADEQUATE_FLUID_REMOVAL_KG) {
      anomalies.push('INADEQUATE_FLUID_REMOVAL');
    }
  }

  // 3. High post-dialysis blood pressure
  if (session.postSystolicBP && session.postDiastolicBP) {
    if (session.postSystolicBP >= ANOMALY_THRESHOLDS.HIGH_SYSTOLIC_BP ||
        session.postDiastolicBP >= ANOMALY_THRESHOLDS.HIGH_DIASTOLIC_BP) {
      anomalies.push('HIGH_BP');
    }
  }

  // 4. Session duration anomalies
  if (session.duration) {
    if (session.duration < ANOMALY_THRESHOLDS.SHORT_SESSION_MIN) {
      anomalies.push('SHORT_SESSION');
    } else if (session.duration > ANOMALY_THRESHOLDS.LONG_SESSION_MAX) {
      anomalies.push('LONG_SESSION');
    }
  }

  return anomalies;
}
console.log( "detectAnomaly",typeof detectAnomalies);
module.exports = { detectAnomalies };