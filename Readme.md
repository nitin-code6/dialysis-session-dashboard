# Dialysis Session Dashboard — Backend
A Node.js + Express + MongoDB API for tracking dialysis sessions and detecting clinical anomalies such as excess weight gain, high blood pressure, and abnormal session duration.

## Tech Stack
* Backend: Node.js, Express
* Database: MongoDB, Mongoose
* Language: JavaScript
* Dev Tools: Nodemon  

## Project Structure

```
backend/
  src/
    config/        # DB connection, constants
    models/        # Patient, Session schemas
    controllers/   # API logic
    routes/        # API routes
    utils/         # anomaly detection logic
    app.js
    server.js
  .env
  seed.js
```
## Data Models
### Patient

Stores static patient information:

* name, age, gender
* dryWeight (baseline weight)
* unit (clinic, indexed for fast queries)
### Session

Stores dynamic dialysis session data:

* patientId (reference to Patient)
* unit (copied from patient for fast queries)
* preWeight, postWeight
* pre/post blood pressure
* duration (minutes)
* machineId, notes
* status (`scheduled`, `in-progress`, `completed`)
* anomalies (detected issues)
* sessionDate (indexed)
## API Endpoints
| Method | Endpoint                 | Description                  |
| ------ | ------------------------ | ---------------------------- |
| POST   | `/patients`              | Create patient               |
| GET    | `/patients`              | Get all patients             |
| POST   | `/sessions`              | Create session (pre data)    |
| PATCH  | `/sessions/:id/complete` | Complete session (post data) |
## Anomaly Detection Logic

Anomalies are computed using session data and patient dry weight.

| Anomaly            | Condition                       | Reason                    |
| ------------------ | ------------------------------- | ------------------------- |
| Excess Weight Gain | `preWeight - dryWeight > 3 kg`  | Unsafe fluid accumulation |
| Inadequate Removal | `postWeight - dryWeight > 2 kg` | Incomplete dialysis       |
| High BP            | `≥ 140 / 90`                    | Hypertension risk         |
| Short Session      | `< 120 min`                     | Incomplete treatment      |
| Long Session       | `> 300 min`                     | Possible complications    |

> Anomalies depending on post data are evaluated only after session completion.
## Business Rules
* A patient cannot have multiple active sessions at the same time
* Only one session per patient per day
* Unit is derived from patient to maintain consistency
* Anomalies are stored to avoid recomputation

## Assumptions & Trade-offs

* **Denormalization:** `unit` stored in session for fast queries
* **No authentication:** skipped for simplicity
* **Simplified workflow:** session created and completed in stages
* **Anomaly storage:** improves performance but requires updates if rules change

## Current Status

* Patient API implemented
* Session creation & completion flow implemented
* Anomaly detection system implemented
* Clean modular backend architecture

## Next Steps

* Todays Schedule API 
* Build React dashboard (session view + anomaly highlights)
* Add filters (unit, anomaly-only)
* Improve validation & edge-case handling



