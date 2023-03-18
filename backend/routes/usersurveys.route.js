const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const app = express();

const user_surveys = require("../controller/user.survey/user.survey.controller");

app.post("/user/survey", protect, (req, res) => {
  user_surveys.addInfo(req, res);
});

app.get("/user/survey", protect, (req, res) => {
  user_surveys.fetchInfo(req, res);
});

app.delete("/user/survey", protect, (req, res) => {
  user_surveys.deleteInfo(req, res);
});

app.put("/user/survey", protect, (req, res) => {
  user_surveys.updateInfo(req, res);
});

module.exports = app;
