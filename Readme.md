# 🩺 Dialysis Session Dashboard — Backend

A minimal yet realistic **Node.js + Express + MongoDB API** for tracking dialysis sessions and detecting clinically significant anomalies such as excess weight gain, high blood pressure, and abnormal session duration.

---

## 🚀 Tech Stack

- **Backend:** Node.js, Express  
- **Database:** MongoDB, Mongoose  
- **Language:** JavaScript  

---

## 📁 Project Structure

backend/
│
├── src/
│   ├── config/        # DB connection, constants
│   ├── models/        # Mongoose schemas
│   ├── controllers/   # Business logic
│   ├── routes/        # API routes
│   ├── utils/         # Anomaly detection logic
│
├── app.js
├── server.js
├── seed.js
├── .env

---
## 📊 Data Models

### Patient

| Field       | Type   | Description                     |
|------------|--------|---------------------------------|
| name       | String | Full name                       |
| age        | Number | Age (0–110)                     |
| gender     | String | male / female / other           |
| dryWeight  | Number | Baseline weight (kg)            |
| unit       | String | Clinic unit (indexed)           |

---
### Session

| Field            | Type     | Description                          |
|------------------|----------|--------------------------------------|
| patientId        | ObjectId | Reference to Patient                 |
| unit             | String   | Copied from patient                  |
| preWeight        | Number   | Pre-dialysis weight                  |
| preSystolicBP    | Number   | Pre systolic BP                      |
| preDiastolicBP   | Number   | Pre diastolic BP                     |
| postWeight       | Number   | Post weight                          |
| postSystolicBP   | Number   | Post systolic BP                     |
| postDiastolicBP  | Number   | Post diastolic BP                    |
| duration         | Number   | Session duration (minutes)           |
| machineId        | String   | Machine identifier                   |
| notes            | String   | Nurse notes                          |
| status           | String   | scheduled / in-progress / completed  |
| anomalies        | [String] | Detected anomalies                   |
| sessionDate      | Date     | Session date (indexed)               |

---

## 🔗 API Endpoints

**Base URL:** `/api`

| Method | Endpoint                     | Description                        |
|--------|-----------------------------|------------------------------------|
| POST   | `/patients`                 | Create patient                     |
| GET    | `/patients`                 | Get all patients                   |
| POST   | `/sessions`                 | Create session                     |
| PATCH  | `/sessions/:id/start`       | Start session                      |
| PATCH  | `/sessions/:id/complete`    | Complete session                   |
| PATCH  | `/sessions/:id/notes`       | Update notes                       |
| GET    | `/sessions`                 | Get today's sessions               |

---

### 🔍 Query Parameters (`GET /sessions`)

| Parameter | Description                          |
|-----------|--------------------------------------|
| date      | YYYY-MM-DD (default: today)          |
| unit      | Filter by clinic unit                |

**Example:**

---

## 🔄 Session Workflow

1. **Create Session** → `scheduled`  
2. **Start Session** → `in-progress`  
3. **Complete Session** → `completed` + anomalies calculated  
4. **Update Notes** → anytime  

---

## ⚠️ Anomaly Detection

Configured in `config/constants.js`.

| Anomaly                     | Condition |
|-----------------------------|----------|
| EXCESS_WEIGHT_GAIN          | preWeight - dryWeight > 3 kg |
| INADEQUATE_FLUID_REMOVAL    | postWeight - dryWeight > 2 kg |
| HIGH_BP                     | systolic ≥ 140 OR diastolic ≥ 90 |
| SHORT_SESSION               | duration < 120 min |
| LONG_SESSION                | duration > 300 min |

---

## 📌 Clinical Assumptions & Trade-offs

- Weight gain threshold **3 kg** → based on common clinical practice  
- High BP threshold **140/90 mmHg** → standard hypertension guideline  
- Session duration **120–300 minutes** → typical dialysis session range    

### Design Decisions

- Thresholds are configurable (no hardcoding)  
- Anomalies stored in database (performance optimized)  
- Unit denormalized for faster queries  
- No authentication (kept minimal for assignment scope)

---

## 📦 Example Requests

### ➤ Create Patient

POST /patients
{
  "name": "John Doe",
  "age": 45,
  "gender": "male",
  "dryWeight": 75.5,
  "unit": "CLINIC A"
}
###  ➤ Create Session

POST /sessions
{
  "patientId": "patient_id",
  "machineId": "MACH-01",
  "preWeight": 78.5,
  "preSystolicBP": 135,
  "preDiastolicBP": 85
}
### ➤ Start Session
PATCH /sessions/:id/start
### ➤ Complete Session
PATCH /sessions/:id/complete
{
  "postWeight": 75.0,
  "postSystolicBP": 142,
  "postDiastolicBP": 88,
  "duration": 240
}
### ➤ Update Notes
PATCH /sessions/:id/notes
{
  "notes": "Patient reported mild dizziness"
}
### ➤ Get Sessions
GET /sessions?unit=CLINIC A

▶️ Running the Project
npm install
Create .env:
PORT=5500
MONGO_URI=mongodb_uri
# Optional: seed data
node seed.js
# Start server
npm run dev

Server URL:

http://localhost:5500