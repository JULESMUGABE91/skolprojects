const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const app = express();

const gifts = require("../controller/gift/gift.controller");

app.post("/gift", protect, (req, res) => {
  gifts.addInfo(req, res);
});

app.get("/gift", protect, (req, res) => {
  gifts.fetchInfo(req, res);
});

app.delete("/gift", protect, (req, res) => {
  gifts.deleteInfo(req, res);
});

app.put("/gift", protect, (req, res) => {
  gifts.updateInfo(req, res);
});

module.exports = app;
