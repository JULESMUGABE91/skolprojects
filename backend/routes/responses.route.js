const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const app = express();

const responses = require("../controller/responses/responses");

app.post("/responses/export", protect, (req, res) => {
  responses.httpGenerateResponse(req, res);
});

module.exports = app;
