module.exports = {
  ANOMALY_THRESHOLDS: {
    // Excess weight gain before dialysis (preWeight - dryWeight)
    EXCESS_WEIGHT_GAIN_KG: 3.0,
    // Inadequate fluid removal – residual after dialysis (postWeight - dryWeight)
    INADEQUATE_FLUID_REMOVAL_KG: 2.0,
    // High blood pressure (post-dialysis)
    HIGH_SYSTOLIC_BP: 140,
    HIGH_DIASTOLIC_BP: 90,
    // Session duration (minutes)
    SHORT_SESSION_MIN: 120,   // < 2 hours
    LONG_SESSION_MAX: 300,    // > 5 hours
  }
};