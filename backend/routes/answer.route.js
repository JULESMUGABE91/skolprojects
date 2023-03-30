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

app.post("/answer/http", protect, (req, res) => {
  answer.httpFetchInfo(req, res);
});

app.post("/answer/survey", protect, (req, res) => {
  answer.httpSurveyAnsweredInfo(req, res);
});

app.post("/answer/delete", protect, (req, res) => {
  answer.deleteInfo(req, res);
});

app.post("/answer/update", protect, (req, res) => {
  answer.updateInfo(req, res);
});

app.post("/answer/same_location", protect, (req, res) => {
  answer.httpAnsweredFromSameLocation(req, res);
});

app.post("/answer/different_location", protect, (req, res) => {
  answer.httpAnsweredFromDifferentLocation(req, res);
});

app.post("/answer/insight", protect, (req, res) => {
  answer.httpAnswersPerQuestion(req, res);
});

app.post("/answer/respondent", protect, (req, res) => {
  answer.httpRespondent(req, res);
});

app.post("/answer/respondent/gender", protect, (req, res) => {
  answer.httpRespondentPerGender(req, res);
});

app.post("/answer/respondent/region", protect, (req, res) => {
  answer.httpRespondentPerRegion(req, res);
});

app.post("/answer/respondent/age_group", protect, (req, res) => {
  answer.httpRespondentPerAgeGroup(req, res);
});

app.post("/answer/status", protect, (req, res) => {
  answer.httpAnswerByStatus(req, res);
});

app.post("/answer/group_user", protect, (req, res) => {
  answer.httpGroupByUser(req, res);
});

module.exports = app;
