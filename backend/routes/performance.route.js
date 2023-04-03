const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const app = express();

const performance = require("../controller/performance/performance.controller");

app.post("/user/performance", protect, (req, res) => {
  performance.httpSurveyorPerformance(req, res);
});

module.exports = app;
