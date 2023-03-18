const express = require("express");

const { handleUpload } = require("../controller/files/files.controller");
const { protect } = require("../middleware/authMiddleware");
const app = express();

app.post("/file/upload", protect, (req, res) => {
  handleUpload(req, res);
});

module.exports = app;
