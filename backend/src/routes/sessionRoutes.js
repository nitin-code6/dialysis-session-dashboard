const express = require("express");
const SessionRouter = express.Router();

const { createSession,completeSession , getTodaysSessions} = require("../controllers/sessionController");

SessionRouter.post("/", createSession);
SessionRouter.patch("/:id/complete", completeSession);
SessionRouter.get("/",  getTodaysSessions);

module.exports = SessionRouter;