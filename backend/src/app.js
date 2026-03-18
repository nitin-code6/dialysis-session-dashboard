const express = require("express");

const app = express();

// middleware
app.use(express.json());

// test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

module.exports = app;