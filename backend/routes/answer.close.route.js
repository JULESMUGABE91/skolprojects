const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const app = express();

const answer = require("../controller/closeQuestionAnswer/closeQuestionAnswer.controller");

app.post("/answer/close_question/create", protect, (req, res) => {
  answer.httpCreate(req, res);
});

app.post("/answer/close_question/generate", protect, (req, res) => {
  answer.httpGenerate(req, res);
});

app.post("/answer/close_question/summary", protect, (req, res) => {
  answer.httpSummary(req, res);
});

module.exports = app;
