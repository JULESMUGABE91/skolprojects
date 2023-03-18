const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const app = express();

const answer = require("../controller/answer/answer.controller");

app.post("/answer/add", protect, (req, res) => {
  answer.addInfo(req, res);
});

app.post("/answer/add/bulk", protect, (req, res) => {
  answer.addBulkInfo(req, res);
});

app.post("/answer/fetch", protect, (req, res) => {
  answer.fetchInfo(req, res);
});

app.post("/answer/survey", protect, (req, res) => {
  answer.fetchSurveyAnsweredInfo(req, res);
});

app.post("/answer/delete", protect, (req, res) => {
  answer.deleteInfo(req, res);
});

app.post("/answer/update", protect, (req, res) => {
  answer.updateInfo(req, res);
});

app.post("/answer/same_location", protect, (req, res) => {
  answer.fetchAnsweredFromSameLocation(req, res);
});

app.post("/answer/different_location", protect, (req, res) => {
  answer.fetchAnsweredFromDifferentLocation(req, res);
});

app.post("/answer/insight", protect, (req, res) => {
  answer.fetchAnswersPerQuestion(req, res);
});

app.post("/answer/respondent", protect, (req, res) => {
  answer.fetchRespondent(req, res);
});

app.post("/answer/respondent/gender", protect, (req, res) => {
  answer.fetchRespondentPerGender(req, res);
});

app.post("/answer/respondent/region", protect, (req, res) => {
  answer.fetchRespondentPerRegion(req, res);
});

app.post("/answer/respondent/age_group", protect, (req, res) => {
  answer.fetchRespondentPerAgeGroup(req, res);
});

app.post("/answer/status", protect, (req, res) => {
  answer.fetchBySurveyStatus(req, res);
});

module.exports = app;
