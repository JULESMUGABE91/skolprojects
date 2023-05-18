// ========================================
// Author: Didier Kibugenza
// Email: kibugenzad@gmail.com
// version: 1.0
// ========================================

const { generateResponseReport } = require("../../model/answer/answer.model");
var path = require("path");

const httpGenerateResponse = async (req, res) => {
  try {
    const info = await generateResponseReport(req.body);

    const { error, filePath, message } = info;

    if (error) return res.status(400).json(error);

    res.status(200).json({
      filePath: path.resolve(filePath),
      message,
    });
  } catch (error) {
    res.status(400).json(error.stack);
  }
};

module.exports = {
  httpGenerateResponse,
};
