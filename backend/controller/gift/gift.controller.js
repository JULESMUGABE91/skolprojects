// ========================================
// Author: Didier Kibugenza
// Email: kibugenzad@gmail.com
// version: 1.0
// ========================================

const {
  createGift,
  findAndDeleteGift,
  findAndUpdateGift,
  findGift,
} = require("../../model/gift/gift.model");
const socket = require("../../utils/socket");
const { validateGift } = require("../../validation/gift.validation.js");

const addInfo = async (req, res) => {
  const { max_point, min_point, file, name, organization } = req.body;

  const user = req.user.id;

  const { error } = validateGift({
    max_point,
    min_point,
    file,
    addedBy: user,
    name,
    organization,
  });

  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    const GiftInfo = await createGift({
      addedBy: user,
      ...req.body,
    });

    global.io && socket("gift");

    res.status(200).json(GiftInfo);
  } catch (error) {
    res.status(400).json(error.stack);
  }
};

const updateInfo = async (req, res) => {
  const { id } = req.body;

  try {
    const GiftInfo = await findAndUpdateGift(id, req.body);

    global.io && socket("gift");

    res.status(200).json(GiftInfo);
  } catch (error) {
    res.status(400).json(error);
  }
};

const deleteInfo = async (req, res) => {
  const { id } = req.body;

  try {
    const GiftInfo = await findAndDeleteGift(id);

    global.io && socket("gift");

    res.status(200).json(GiftInfo);
  } catch (error) {
    res.status(400).json(error);
  }
};

const fetchInfo = async (req, res) => {
  try {
    const giftInfo = await findGift(req.body);

    res.status(200).json(giftInfo);
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
