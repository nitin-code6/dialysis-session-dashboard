const express = require("express");
const SessionRouter = express.Router();

const { createSession } = require("../controllers/sessionController");

SessionRouter.post("/", createSession);

module.exports = SessionRouter;