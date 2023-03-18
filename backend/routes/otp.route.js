const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const app = express();

const { httpSendOTP, httpVerifyOTP } = require("../controller/otp/otp.controller");

app.post("/otp/send", protect, (req, res) => {
  httpSendOTP(req, res);
});

app.post("/otp/verify", protect, (req, res) => {
  httpVerifyOTP(req, res);
});

module.exports = app;
