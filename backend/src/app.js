const express = require("express");
const sessionRoutes = require("./routes/sessionRoutes");
const patientRoutes = require("./routes/patientRoutes");
// console.log(patientRoutes);
// console.log("Patient routes loaded");

const app = express();

// middleware
app.use(express.json());
app.use("/api/sessions", sessionRoutes);
app.use("/api/patients", patientRoutes);
// test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

module.exports = app;