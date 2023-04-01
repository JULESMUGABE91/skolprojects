const express = require("express");

const {
  handleUpload,
  httpHandlePDF,
} = require("../controller/files/files.controller");
const { protect } = require("../middleware/authMiddleware");
const app = express();

app.post("/file/upload", protect, (req, res) => {
  handleUpload(req, res);
});

app.get("/file/read/pdf", (req, res) => {
  httpHandlePDF(req, res);
});

module.exports = app;
