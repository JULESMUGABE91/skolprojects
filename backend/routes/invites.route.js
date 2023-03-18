const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const app = express();

const invites = require("../controller/invites/invites.controller.js");

app.get("/invites", protect, (req, res) => {
  invites.fetchInfo(req, res);
});

module.exports = app;
