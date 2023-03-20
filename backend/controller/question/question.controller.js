// ========================================
// Author: Didier Kibugenza
// Email: kibugenzad@gmail.com
// version: 1.0
// ========================================

const {
  createQuestion,
  findAndDeleteQuestion,
  findAndUpdateQuestion,
  findQuestion,
} = require("../../model/question/question.model");
const socket = require("../../utils/socket");
const { validateQuestion } = require("../../validation/question.validation.js");

const addInfo = async (req, res) => {
  const { question, survey } = req.body;

  const user = req.user.id;

  const { error } = validateQuestion({
    survey,
    question,
    user,
  });

  if (error) return res.status(400).json({ error: error.details[0].message });
  try {
    const questionInfo = await createQuestion({
      user,
      ...req.body,
    });

    global.io && socket("question");

    res.status(200).json(questionInfo);
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};

const updateInfo = async (req, res) => {
  const { id } = req.body;

  try {
    const questionInfo = await findAndUpdateQuestion(id, req.body);

    global.io && socket("question");

    res.status(200).json(questionInfo);
  } catch (error) {
    res.status(400).json(error);
  }
};

const deleteInfo = async (req, res) => {
  const { id } = req.body;
  console.log({ id });

  try {
    const questionInfo = await findAndDeleteQuestion(id);

    global.io && socket("question");

    res.status(200).json(questionInfo);
  } catch (error) {
    res.status(400).json(error.stack);
  }
};

const fetchInfo = async (req, res) => {
  try {
    const questionInfo = await findQuestion(req.body);

    res.status(200).json(questionInfo);
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
