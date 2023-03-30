const express = require("express");
const { httpEmail } = require("../controller/email/email.controller");
const { protect } = require("../middleware/authMiddleware");
const app = express();

app.post("/answer/email", protect, (req, res) => {
  httpEmail(req, res);
});

module.exports = app;
