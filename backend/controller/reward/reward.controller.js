// ========================================
// Author: Didier Kibugenza
// Email: kibugenzad@gmail.com
// version: 1.0
// ========================================

const {
  createReward,
  findReward,
  findAndDeleteReward,
  findAndUpdateReward,
} = require("../../model/reward/reward.model");
const { validateReward } = require("../../validation/reward.validation.js");

const addInfo = async (req, res) => {
  const user = req.user.id;

  const { error } = validateReward({
    user,
  });

  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    const answerInfo = await createReward({
      user,
      ...req.body,
    });

    res.status(200).json(answerInfo);
  } catch (error) {
    res.status(400).json(error);
  }
};

const updateInfo = async (req, res) => {
  const { id } = req.body;

  try {
    const rewardInfo = await findAndUpdateReward(id, req.body);

    res.status(200).json(rewardInfo);
  } catch (error) {
    res.status(400).json(error);
  }
};

const deleteInfo = async (req, res) => {
  const { id } = req.body;

  try {
    const rewardInfo = await findAndDeleteReward(id);

    res.status(200).json(rewardInfo);
  } catch (error) {
    res.status(400).json(error);
  }
};

const fetchInfo = async (req, res) => {
  const { user } = req.body;

  try {
    const rewardInfo = await findReward(req.body);

    res.status(200).json(rewardInfo);
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
