const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const app = express();

const reward = require("../controller/reward/reward.controller");

app.post("/reward/add", protect, (req, res) => {
  reward.addInfo(req, res);
});

app.post("/reward/fetch", protect, (req, res) => {
  reward.fetchInfo(req, res);
});

app.post("/reward/delete", protect, (req, res) => {
  reward.deleteInfo(req, res);
});

app.post("/reward/update", protect, (req, res) => {
  reward.updateInfo(req, res);
});

module.exports = app;
