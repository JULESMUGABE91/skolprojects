// ========================================
// Author: Didier Kibugenza
// Email: kibugenzad@gmail.com
// version: 1.0
// ========================================

const { generatePDFReport } = require("../../services/pdf/answer");

const httpAnswerPDFReport = async (req, res) => {
  try {
    const info = await generatePDFReport(req.body);

    res.status(200).json(info);
  } catch (error) {
    res.status(400).json(error.stack);
  }
};

module.exports = {
  httpAnswerPDFReport,
};
