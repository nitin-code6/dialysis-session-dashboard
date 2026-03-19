const express = require("express");
const SessionRouter = express.Router();

const {
  createSession,
  startSession,
  completeSession,
  updateNotes,
  getTodaysSessions
} = require("../controllers/sessionController");

SessionRouter.post("/", createSession);
SessionRouter.patch("/:id/start", startSession);
SessionRouter.patch("/:id/complete", completeSession);
SessionRouter.patch("/:id/notes", updateNotes);
SessionRouter.get("/", getTodaysSessions);

module.exports = SessionRouter;