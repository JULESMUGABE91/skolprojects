const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const app = express();

const respondent = require("../controller/respondent/respondent.controller");

app.post("/respondent/fetch", protect, (req, res) => {
  respondent.getInfo(req, res);
});

module.exports = app;
