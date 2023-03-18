// ========================================
// Author: Didier Kibugenza
// Email: kibugenzad@gmail.com
// version: 1.0
// ========================================

const { findQuestion } = require("../../model/question/question.model");
const {
  createUserAnsweredSurvey,
  findAndDeleteUserSurvey,
  findAndUpdateUserSurvey,
  findUserSurvey,
} = require("../../model/user.survey/user.survey.model");
const socket = require("../../utils/socket");
const {
  validateSurvey,
  validateUserAnsweredSurvey,
} = require("../../validation/survey.validation");

const addInfo = async (req, res) => {
  const { organization, survey } = req.body;

  const user = req.user.id;

  const { error } = validateUserAnsweredSurvey({
    survey,
    organization,
    user,
  });

  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    const surveyInfo = await createUserAnsweredSurvey({
      user: req.user.id,
      ...req.body,
    });

    global.io && socket("survey");

    res.status(200).json(surveyInfo);
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};

const updateInfo = async (req, res) => {
  const { id } = req.body;

  try {
    const surveyInfo = await findAndUpdateUserSurvey(id, req.body);

    global.io && socket("survey");

    res.status(200).json(surveyInfo);
  } catch (error) {
    res.status(400).json(error);
  }
};

const deleteInfo = async (req, res) => {
  const { id } = req.body;

  try {
    const surveyInfo = await findAndDeleteUserSurvey(id);

    global.io && socket("survey");

    res.status(200).json(surveyInfo);
  } catch (error) {
    res.status(400).json(error);
  }
};

const fetchInfo = async (req, res) => {
  try {
    const surveyInfo = await findUserSurvey(req.query);

    res.status(200).json(surveyInfo);
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};

module.exports = {
  addInfo,
  deleteInfo,
  updateInfo,
  fetchInfo,
};
