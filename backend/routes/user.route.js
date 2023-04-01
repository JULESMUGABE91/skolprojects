const express = require("express");
const app = express();

const user = require("../controller/user/user.controller");
const admin_email = require("../controller/admin_email/admin_email.controller");
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

app.post("/user/admin_email_info", protect, (req, res) => {
  admin_email.httpCreate(req, res);
});

app.get("/user/admin_email_info", protect, (req, res) => {
  admin_email.httpGetInfo(req, res);
});

app.put("/user/admin_email_info", protect, (req, res) => {
  admin_email.httpUpdateInfo(req, res);
});

app.delete("/user/admin_email_info", protect, (req, res) => {
  admin_email.httpDeleteInfo(req, res);
});

module.exports = app;
