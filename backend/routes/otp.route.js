const express = require("express");
const app = express();

const { httpSendOTP, httpVerifyOTP } = require("../controller/otp/otp.controller");

app.post("/otp/send", (req, res) => {
  httpSendOTP(req, res);
});

app.post("/otp/verify", (req, res) => {
  httpVerifyOTP(req, res);
});

module.exports = app;
