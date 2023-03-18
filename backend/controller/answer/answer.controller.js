// ========================================
// Author: Didier Kibugenza
// Email: kibugenzad@gmail.com
// version: 1.0
// ========================================

const {
  createAnswer,
  findAndDeleteAnswer,
  findAndUpdateAnswer,
  findAnswer,
  findMySurvey,
  findAnswersFromSameLocation,
  findAnswersFromDifferentLocation,
  findInsightAnswers,
  fetchRespondents,
  createBulkAnswer,
  fetchRespondentsByGender,
  fetchRespondentsByRegion,
  fetchRespondentsByAgeGroup,
  fetchByStatus,
} = require("../../model/answer/answer.model");
const {
  validateAnswer,
  validateBulkAnswer,
} = require("../../validation/answer.validation.js");
const socket = require("../../utils/socket");

const addInfo = async (req, res) => {
  const { answers, question, survey, organization, identifier } = req.body;

  const user = req.user.id;

  const { error } = validateAnswer({
    question,
    answers,
    user,
    identifier,
    survey,
    organization,
  });

  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    const answerInfo = await createAnswer({
      user,
      ...req.body,
    });

    res.status(200).json(answerInfo);
  } catch (error) {
    res.status(400).json(error);
  }
};

const addBulkInfo = async (req, res) => {
  const { questions, survey, organization, identifier } = req.body;

  const user = req.user.id;

  const { error } = validateBulkAnswer({
    questions,
    user,
    identifier,
    survey,
    organization,
  });

  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    const answerInfo = await createBulkAnswer({
      user,
      ...req.body,
    });

    res.status(200).json(answerInfo);
  } catch (error) {
    res.status(400).json(error.stack);
  }
};

const updateInfo = async (req, res) => {
  const { id } = req.body;

  try {
    const answerInfo = await findAndUpdateAnswer(id, req.body);

    global.io && socket("answer");

    res.status(200).json(answerInfo);
  } catch (error) {
    res.status(400).json(error);
  }
};

const deleteInfo = async (req, res) => {
  const { id } = req.body;

  try {
    const answerInfo = await findAndDeleteAnswer(id);

    global.io && socket("answer");

    res.status(200).json(answerInfo);
  } catch (error) {
    res.status(400).json(error);
  }
};

const fetchInfo = async (req, res) => {
  try {
    const answerInfo = await findAnswer(req.body);

    res.status(200).json(answerInfo);
  } catch (error) {
    res.status(400).json(error);
  }
};

const fetchSurveyAnsweredInfo = async (req, res) => {
  try {
    const answerInfo = await findMySurvey(req.body);

    res.status(200).json(answerInfo);
  } catch (error) {
    res.status(400).json(error);
  }
};

const fetchAnsweredFromSameLocation = async (req, res) => {
  try {
    const answerInfo = await findAnswersFromSameLocation(req.body);

    res.status(200).json(answerInfo);
  } catch (error) {
    res.status(400).json(error);
  }
};

const fetchAnsweredFromDifferentLocation = async (req, res) => {
  try {
    const answerInfo = await findAnswersFromDifferentLocation(req.body);

    res.status(200).json(answerInfo);
  } catch (error) {
    res.status(400).json(error);
  }
};

const fetchAnswersPerQuestion = async (req, res) => {
  try {
    const answerInfo = await findInsightAnswers(req.body);

    res.status(200).json(answerInfo);
  } catch (error) {
    console.log(error);
    res.status(400).json(error.stack);
  }
};

const fetchRespondent = async (req, res) => {
  try {
    const answerInfo = await fetchRespondents(req.body);

    res.status(200).json(answerInfo);
  } catch (error) {
    res.status(400).json(error.stack);
  }
};

const fetchRespondentPerGender = async (req, res) => {
  try {
    const answerInfo = await fetchRespondentsByGender(req.body);

    res.status(200).json(answerInfo);
  } catch (error) {
    res.status(400).json(error.stack);
  }
};

const fetchRespondentPerRegion = async (req, res) => {
  try {
    const answerInfo = await fetchRespondentsByRegion(req.body);

    res.status(200).json(answerInfo);
  } catch (error) {
    res.status(400).json(error.stack);
  }
};

const fetchRespondentPerAgeGroup = async (req, res) => {
  try {
    const answerInfo = await fetchRespondentsByAgeGroup(req.body);

    res.status(200).json(answerInfo);
  } catch (error) {
    res.status(400).json(error.stack);
  }
};

const fetchBySurveyStatus = async (req, res) => {
  try {
    const answerInfo = await fetchByStatus(req.body);

    res.status(200).json(answerInfo);
  } catch (error) {
    res.status(400).json(error.stack);
  }
};

module.exports = {
  addInfo,
  deleteInfo,
  updateInfo,
  fetchInfo,
  fetchSurveyAnsweredInfo,
  fetchAnsweredFromSameLocation,
  fetchAnsweredFromDifferentLocation,
  fetchAnswersPerQuestion,
  fetchRespondent,
  addBulkInfo,
  fetchRespondentPerGender,
  fetchRespondentPerRegion,
  fetchBySurveyStatus,
  fetchRespondentPerAgeGroup,
};
