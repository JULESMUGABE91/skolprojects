// ========================================
// Author: Didier Kibugenza
// Email: kibugenzad@gmail.com
// version: 1.0
// ========================================

const { findAnswer } = require("../../model/answer/answer.model");
const { findQuestion } = require("../../model/question/question.model");
const {
  createSurvey,
  findAndDeleteSurvey,
  findAndUpdateSurvey,
  findSurvey,
} = require("../../model/survey/survey.model");
const socket = require("../../utils/socket");
const { validateSurvey } = require("../../validation/survey.validation");

const addInfo = async (req, res) => {
  const { title } = req.body;

  const { error } = validateSurvey({
    title,
  });

  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    const surveyInfo = await createSurvey({
      user: req.user.id,
      ...req.body,
    });

    global.io && socket("survey");

    res.status(200).json(surveyInfo);
  } catch (error) {
    res.status(400).json(error);
  }
};

const updateInfo = async (req, res) => {
  const { id } = req.body;

  try {
    const surveyInfo = await findAndUpdateSurvey(id, req.body);

    global.io && socket("survey");

    res.status(200).json(surveyInfo);
  } catch (error) {
    res.status(400).json(error);
  }
};

const deleteInfo = async (req, res) => {
  const { id } = req.body;

  try {
    const surveyInfo = await findAndDeleteSurvey(id);

    global.io && socket("survey");

    res.status(200).json(surveyInfo);
  } catch (error) {
    res.status(400).json(error);
  }
};

const fetchInfo = async (req, res) => {
  try {
    const surveyInfo = await findSurvey(req.body);

    let results = [];

    for (let survey of surveyInfo) {
      const questions = await findQuestion({
        survey: survey._id,
      });

      results.push({ ...survey._doc, questions });
    }

    res.status(200).json(results);
  } catch (error) {
    res.status(400).json(error);
  }
};

module.exports = {
  addInfo,
  deleteInfo,
  updateInfo,
  fetchInfo,
};
