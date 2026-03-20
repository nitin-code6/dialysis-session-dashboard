# 🏥 Dialysis Session Intake & Anomaly Dashboard
A full-stack web application for dialysis centers to track patient sessions, record vitals, and automatically detect clinical anomalies such as excess weight gain, high blood pressure, and abnormal session duration.

<p align="center">
  <img src="./assets/DASHBOARD.png" alt="Dialysis Dashboard" width="800"/>
</p>

## 📋 Table of Contents

* [🎥 Demo Video](#-demo-video)
* [✨ Features](#-features)
* [🛠 Tech Stack](#-tech-stack)
* [🚀 Setup Instructions](#-setup-instructions)
* [📸 Screenshots](#-screenshots)
* [📄 API Documentation](#-api-documentation)
* [⚠️ Anomaly Detection](#️-anomaly-detection)
* [🧪 Clinical Assumptions & Trade-offs](#-clinical-assumptions--trade-offs)
* [🏗 Architecture Overview](#-architecture-overview)
* [🧪 Testing](#-testing)
* [🚧 Limitations & Future Improvements](#-limitations--future-improvements)
* [🤖 AI Usage](#-ai-usage)
* [👨‍💻 Author](#-author)

## 🎥 Demo Video

> 🔗 Add your YouTube demo link here
[![Watch Demo](https://img.shields.io/badge/Watch-Demo-red?style=for-the-badge\&logo=youtube)](https://youtu.be/nMLr5rhRURk)


## ✨ Features

### 🔧 Backend

* Patient registration (name, age, gender, dry weight, clinic unit)
* Session creation with pre-dialysis vitals
* Start & complete session workflows
* Post-dialysis vitals
* Update nurse notes
* Automatic anomaly detection
* Prevent duplicate active sessions
* Fetch today's schedule with filters

### 💻 Frontend

* Dashboard with real-time session overview
* Status badges: *Not Started*, *In Progress*, *Completed*
* Highlighted anomaly badges (color-coded)
* Add session (modal form)
* Edit notes (inline modal)
* Start/Complete session actions
* Filter by unit
* Filter by anomalies
* Loading, error & empty states

---

## 🛠 Tech Stack

| Layer     | Technology                            |
| --------- | ------------------------------------- |
| Frontend  | React (Vite) + Tailwind CSS + DaisyUI |
| Backend   | Node.js + Express                     |
| Database  | MongoDB + Mongoose                    |
| Language  | JavaScript (ES6+)                     |
| Dev Tools | Nodemon                               |

---

## Setup Instruction

### 1. Environment Setup
Create a `.env` file inside the `backend` folder:

.env
PORT=5500
MONGO_URI=mongodb+srv://username:password@cluster/dialysis



### 1️⃣ Clone Repository
git clone https://github.com/nitin-code6/dialysis-session-dashboard.git
cd DIALYSIS_DASHBOARD

### 2️⃣ Install and Seed
# Backend
cd backend
npm install
npm run seed          # populates the database with sample patients and sessions

# Frontend
cd ../frontend
npm install

### 3. Run the Application
* Terminal 1 – Backend


cd backend
npm run dev
Server runs at http://localhost:5500.

* Terminal 2 – Frontend

cd frontend
npm run dev
App opens at http://localhost:3000.


### 📸 Screenshots

Place your screenshots in a `screenshots` folder at the project root. Then use the following table to display them:

| Dashboard | Add Session | Register Patient|
|-----------|-------------|------------------|
| ![Dashboard](./assets/DASHBOARD.png) | ![Add Session](./assets/CreateSession.png) | ![Complete Session](./assets/RegisterNewPatient.png) |

## 📄 API Documentation

Base URL:

```
/api/
```

> ⚠️ No authentication (demo only)

---

### 👤 Patients

| Method | Endpoint  | Description      |
| ------ | --------- | ---------------- |
| POST   | /patients | Create patient   |
| GET    | /patients | Get all patients |

**Example**

```json
{
  "name": "John Doe",
  "age": 45,
  "gender": "male",
  "dryWeight": 75.5,
  "unit": "CLINIC A"
}
```

---

### 💉 Sessions

| Method | Endpoint               | Description      |
| ------ | ---------------------- | ---------------- |
| POST   | /sessions              | Create session   |
| PATCH  | /sessions/:id/start    | Start session    |
| PATCH  | /sessions/:id/complete | Complete session |
| PATCH  | /sessions/:id/notes    | Update notes     |
| GET    | /sessions              | Get schedule     |

---

## ⚠️ Anomaly Detection

| Anomaly                  | Condition  |
| ------------------------ | ---------- |
| Excess Weight Gain       | > 3.0 kg   |
| Inadequate Fluid Removal | > 2.0 kg   |
| High Blood Pressure      | ≥ 140 / 90 |
| Short Session            | < 120 min  |
| Long Session             | > 300 min  |

📌 Config:

```
backend/src/config/constants.js
```

---

## 🧪 Clinical Assumptions & Trade-offs

### ✅ Assumptions

* Safe fluid removal: 3.0 kg
* Residual fluid: 2.0 kg
* BP threshold: 140/90
* Duration: 120–300 min

### ⚖️ Trade-offs

* Stored anomalies (no recompute)
* No authentication
* Manual selection


---

## 🏗️ Architecture Overview

The system is designed using a clean separation of concerns between the backend and frontend:

- **Backend (Node.js + Express + MongoDB)**
  - Handles API requests, business logic, and anomaly detection
  - Organized into controllers, models, routes, and services

- **Frontend (React)**
  - Handles UI rendering and user interaction
  - Uses reusable components, hooks, and API services

- **Data Flow**
  1. User interacts with UI
  2. Frontend calls backend APIs
  3. Backend processes data and detects anomalies
  4. Response is sent back and displayed with highlights

Below is the high-level architecture diagram:

![Architecture Diagram](./assets/architecture.png)
---

## 🧪 Testing

Due to time constraints, full test coverage is not implemented.However, the application is structured to support testing easily:
- Backend:
  - Anomaly detection logic is isolated (`utils/anomaly.js`)
  - API routes are modular and testable

- Frontend:
  - Components are reusable and separated from logic (hooks/services)

### Planned Tests (Not Implemented Yet)
- Backend:
  - anomalyService.test.js (business logic)
  - sessions.test.js (API route)

- Frontend:
  - SessionCard.test.jsx (UI component)

## 🚧 Limitations & Future Improvements

### ❌ Limitations
- No authentication/authorization  
- No real-time updates  
- Basic timezone handling (UTC)  
- Assumes consistent data units  
- Limited test coverage  

### 🔮 Future Improvements
- Add JWT-based authentication  
- Enable real-time updates (WebSockets)  
- Add charts & analytics  
- Improve anomaly detection (configurable / ML-based)  
- Implement pagination & better validation  

## 🤖 AI Usage

This project was developed with the help of ChatGPT, DeepSeek, Google AI Studio, to accelerate development within the 6–10 hour time limit.

**Used for:**
- Project setup and boilerplate
- Debugging API and React issues
- Exploring data models and anomaly logic
- Designing and generating frontend UI
- Writing Readme 


**Manual improvements:**
- Tuned anomaly thresholds (e.g., 2 kg → 3 kg)
- Refined session flow (create → start → complete)
- Simplified structure to avoid over-engineering

All AI-generated code was carefully reviewed and modified. Final decisions and implementation were made intentionally.

## 👨‍💻 Author

**Nitin Kumar**
https://github.com/nitin-code6/dialysis-session-dashboard.git
---

## ✅ Project Status

| Feature           | Status        |
| ----------------- | ------------- |
| Backend           | ✅ Complete    |
| Frontend          | ✅ Complete    |
| Anomaly Detection | ✅ Implemented |
| API Docs          | ✅ Done        |
| Testing           | ✅ Basic       |
| Ready             | ✅ Yes         |

---

