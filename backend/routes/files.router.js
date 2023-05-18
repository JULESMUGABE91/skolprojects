const express = require("express");

const {
  handleUpload,
  httpHandlePDF,
  httpHandleCSV,
} = require("../controller/files/files.controller");
const { protect } = require("../middleware/authMiddleware");
const app = express();

app.post("/file/upload", protect, (req, res) => {
  handleUpload(req, res);
});

app.get("/file/read/pdf", (req, res) => {
  httpHandlePDF(req, res);
});

app.get("/file/read/csv", (req, res) => {
  httpHandleCSV(req, res);
});

module.exports = app;
