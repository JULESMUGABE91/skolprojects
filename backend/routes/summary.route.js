const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const app = express();

const summary = require("../controller/summary/summary.controller");

app.post("/summary/regionGenderAgeGroup", protect, (req, res) => {
  summary.httpRegionGenderAgeGroup(req, res);
});

app.post("/summary/regionGender", protect, (req, res) => {
  summary.httpRegionGender(req, res);
});

app.post("/summary/genderAgeGroup", protect, (req, res) => {
  summary.httpGenderAgeGroup(req, res);
});
module.exports = app;
