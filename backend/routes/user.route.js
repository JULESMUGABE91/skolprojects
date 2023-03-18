const express = require("express");
const app = express();

const user = require("../controller/user/user.controller");
const { protect } = require("../middleware/authMiddleware");

app.post("/user/phone-auth", (req, res) => {
  user.onPhoneAuth(req, res);
});

app.post("/user/update", protect, (req, res) => {
  user.updateInfo(req, res);
});

app.post("/user/fetch", protect, (req, res) => {
  user.getInfo(req, res);
});

module.exports = app;
