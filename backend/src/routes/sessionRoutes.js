const express = require("express");
const SessionRouter = express.Router();

const { createSession,completeSession } = require("../controllers/sessionController");

SessionRouter.post("/", createSession);
SessionRouter.patch("/:id/complete", completeSession);
module.exports = SessionRouter;