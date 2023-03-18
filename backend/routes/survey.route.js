const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const app = express();

const survey = require("../controller/survey/survey.controller");

app.post("/survey/add", protect, (req, res) => {
  survey.addInfo(req, res);
});

app.post("/survey/fetch", protect, (req, res) => {
  survey.fetchInfo(req, res);
});

app.post("/survey/delete", protect, (req, res) => {
  survey.deleteInfo(req, res);
});

app.post("/survey/update", protect, (req, res) => {
  survey.updateInfo(req, res);
});

module.exports = app;
