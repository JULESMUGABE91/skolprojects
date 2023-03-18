const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const app = express();

const provider = require("../controller/provider/provider.controller");

app.post("/provider", protect, (req, res) => {
  provider.addInfo(req, res);
});

app.get("/provider", protect, (req, res) => {
  provider.fetchInfo(req, res);
});

app.delete("/provider", protect, (req, res) => {
  provider.deleteInfo(req, res);
});

app.put("/provider", protect, (req, res) => {
  provider.updateInfo(req, res);
});

module.exports = app;
