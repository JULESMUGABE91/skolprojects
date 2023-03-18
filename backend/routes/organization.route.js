const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const app = express();

const organization = require("../controller/organization/organization.controller");

app.post("/organization", protect, (req, res) => {
  organization.addInfo(req, res);
});

app.get("/organization", protect, (req, res) => {
  organization.fetchInfo(req, res);
});

app.delete("/organization", protect, (req, res) => {
  organization.deleteInfo(req, res);
});

app.put("/organization", protect, (req, res) => {
  organization.updateInfo(req, res);
});

module.exports = app;
