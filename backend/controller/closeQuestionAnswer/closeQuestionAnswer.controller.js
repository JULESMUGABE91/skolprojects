// ========================================
// Author: Didier Kibugenza
// Email: kibugenzad@gmail.com
// version: 1.0
// ========================================

const {
  createCloseQuestion,
  fetchAnswerAndGenerateCloseQuestionAnswers,
} = require("../../model/closeQuestionAnswer/closeQuestionAnswer.model");
const fetchSummaryCloseQuestion = require("../../model/summary/fetchSummaryCloseQuestion");

const httpCreate = async (req, res) => {
  try {
    const emailInfo = await createCloseQuestion(req.body);

    res.status(200).json(emailInfo);
  } catch (error) {
    res.status(400).json(error.stack);
  }
};

const httpGenerate = async (req, res) => {
  try {
    const dataInfo = await fetchAnswerAndGenerateCloseQuestionAnswers(req.body);

    res.status(200).json(dataInfo);
  } catch (error) {
    res.status(400).json(error.stack);
  }
};

const httpSummary = async (req, res) => {
  try {
    const dataInfo = await fetchSummaryCloseQuestion(req.body);

    res.status(200).json(dataInfo);
  } catch (error) {
    res.status(400).json(error.stack);
  }
};

module.exports = {
  httpCreate,
  httpGenerate,
  httpSummary,
};
