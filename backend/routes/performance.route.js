const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const app = express();

const performance = require("../controller/performance/performance.controller");

app.post("/user/performance", protect, (req, res) => {
  performance.httpSurveyorPerformance(req, res);
});

app.post("/user/single/performance", protect, (req, res) => {
  performance.httpSingleSurveyorPerformance(req, res);
});

module.exports = app;
