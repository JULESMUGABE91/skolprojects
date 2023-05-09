const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const app = express();

const responses = require("../controller/answer/responses.controller");

app.post("/answer/stats", protect, (req, res) => {
  responses.httpFetchInfo(req, res);
});

module.exports = app;
