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
  fetchAndGroupByUser,
  fetchIncomplete,
  fetchResponses,
  fetchIncompleteResponses,
  fetchClosedInterviews,
} = require("../../model/answer/answer.model");
const {
  validateAnswer,
  validateBulkAnswer,
} = require("../../validation/answer.validation.js");
const socket = require("../../utils/socket");
const { httpAnswerPDFReport } = require("../report/report.controller");
const updateAllAnswers = require("../../model/answer/updateAllAnswers");

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

  const common = {
    user,
    identifier,
    survey,
    organization,
  };

  const { error } = validateBulkAnswer({
    questions,
    ...common,
  });

  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    const answerInfo = await createBulkAnswer({
      user,
      ...req.body,
    });

    await httpAnswerPDFReport({
      ...common,
      channel: ["email"],
    });

    res.status(200).json(answerInfo);
  } catch (error) {
    console.log(error.stack);
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

const httpFetchInfo = async (req, res) => {
  try {
    const answerInfo = await findAnswer(req.body);

    res.status(200).json(answerInfo);
  } catch (error) {
    res.status(400).json(error.stack);
  }
};

const httpSurveyAnsweredInfo = async (req, res) => {
  try {
    const answerInfo = await findMySurvey(req.body);

    res.status(200).json(answerInfo);
  } catch (error) {
    res.status(400).json(error);
  }
};

const httpAnsweredFromSameLocation = async (req, res) => {
  try {
    const answerInfo = await findAnswersFromSameLocation(req.body);

    res.status(200).json(answerInfo);
  } catch (error) {
    res.status(400).json(error);
  }
};

const httpAnsweredFromDifferentLocation = async (req, res) => {
  try {
    const answerInfo = await findAnswersFromDifferentLocation(req.body);

    res.status(200).json(answerInfo);
  } catch (error) {
    res.status(400).json(error);
  }
};

const httpAnswersPerQuestion = async (req, res) => {
  try {
    const answerInfo = await findInsightAnswers(req.body);

    res.status(200).json(answerInfo);
  } catch (error) {
    res.status(400).json(error.stack);
  }
};

const httpRespondent = async (req, res) => {
  try {
    const answerInfo = await fetchRespondents(req.body);

    res.status(200).json(answerInfo);
  } catch (error) {
    res.status(400).json(error.stack);
  }
};

const httpRespondentPerGender = async (req, res) => {
  try {
    const answerInfo = await fetchRespondentsByGender(req.body);

    res.status(200).json(answerInfo);
  } catch (error) {
    res.status(400).json(error.stack);
  }
};

const httpRespondentPerRegion = async (req, res) => {
  try {
    const answerInfo = await fetchRespondentsByRegion(req.body);

    res.status(200).json(answerInfo);
  } catch (error) {
    res.status(400).json(error.stack);
  }
};

const httpRespondentPerAgeGroup = async (req, res) => {
  try {
    const answerInfo = await fetchRespondentsByAgeGroup(req.body);

    res.status(200).json(answerInfo);
  } catch (error) {
    res.status(400).json(error.stack);
  }
};

const httpAnswerByStatus = async (req, res) => {
  try {
    const answerInfo = await fetchByStatus(req.body);

    res.status(200).json(answerInfo);
  } catch (error) {
    res.status(400).json(error.stack);
  }
};

const httpGroupByUser = async (req, res) => {
  try {
    const answerInfo = await fetchAndGroupByUser(req.body);

    res.status(200).json(answerInfo);
  } catch (error) {
    res.status(400).json(error.stack);
  }
};

const httpIncomplete = async (req, res) => {
  try {
    const answerInfo = await fetchIncomplete(req.body);

    res.status(200).json(answerInfo);
  } catch (error) {
    res.status(400).json(error.stack);
  }
};

const httpUpdateAll = async (req, res) => {
  try {
    const answerInfo = await updateAllAnswers(req.body);

    res.status(200).json(answerInfo);
  } catch (error) {
    res.status(400).json(error.stack);
  }
};

const httpFetchResponses = async (req, res) => {
  try {
    const answerInfo = await fetchResponses(req.body);

    res.status(200).json(answerInfo);
  } catch (error) {
    res.status(400).json(error.stack);
  }
};

const httpFetchIncompleteResponses = async (req, res) => {
  try {
    const answerInfo = await fetchIncompleteResponses(req.body);

    res.status(200).json(answerInfo);
  } catch (error) {
    res.status(400).json(error.stack);
  }
};

const httpFetchClosedInterview = async (req, res) => {
  try {
    const answerInfo = await fetchClosedInterviews(req.body);

    res.status(200).json(answerInfo);
  } catch (error) {
    res.status(400).json(error.stack);
  }
};

module.exports = {
  addInfo,
  deleteInfo,
  updateInfo,
  httpFetchInfo,
  httpSurveyAnsweredInfo,
  httpAnsweredFromSameLocation,
  httpAnsweredFromDifferentLocation,
  httpAnswersPerQuestion,
  httpRespondent,
  addBulkInfo,
  httpRespondentPerGender,
  httpRespondentPerRegion,
  httpAnswerByStatus,
  httpRespondentPerAgeGroup,
  httpGroupByUser,
  httpIncomplete,
  httpUpdateAll,
  httpFetchResponses,
  httpFetchIncompleteResponses,
  httpFetchClosedInterview,
};
