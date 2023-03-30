const express = require("express");
const {
  httpAnswerPDFReport,
} = require("../controller/report/report.controller");
const { protect } = require("../middleware/authMiddleware");
const app = express();

app.post("/answer/report/pdf", protect, (req, res) => {
  httpAnswerPDFReport(req, res);
});

module.exports = app;
