const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const app = express();

const question = require("../controller/question/question.controller");

app.post("/question/add", protect, (req, res) => {
  console.log(req.body);
  question.addInfo(req, res);
});

app.post("/question/fetch", protect, (req, res) => {
  question.fetchInfo(req, res);
});

app.post("/question/delete", protect, (req, res) => {
  question.deleteInfo(req, res);
});

app.post("/question/update", protect, (req, res) => {
  question.updateInfo(req, res);
});

module.exports = app;
