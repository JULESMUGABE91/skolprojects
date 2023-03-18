// ========================================
// Author: Didier Kibugenza
// Email: kibugenzad@gmail.com
// version: 1.0
// ========================================

const {
  findUserByPhone,
  createUser,
  findUserAndUpdate,
  findUseById,
  findUser,
} = require("../../model/users/users.model");
const { validatePhoneAuth } = require("../../validation/user.validation");
const generateToken = require("../../utils/usersHelp/generateToken");
const socket = require("../../utils/socket");

const onPhoneAuth = async (req, res) => {
  const { phone } = req.body;

  const { error } = validatePhoneAuth({
    phone,
  });

  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    const users = await findUserByPhone(phone);

    let userInfo = {};

    if (users.length > 0) {
      const _id = users[0]._id;

      userInfo = await findUseById(_id);
    } else {
      userInfo = await createUser(req.body);
    }

    global.io && socket("user", userInfo);

    res.status(200).json({
      success: true,
      ...userInfo._doc,
      token: generateToken(userInfo._doc)
    });
  } catch (error) {
    res.status(400).json(error.stack);
  }
};

const updateInfo = async (req, res) => {
  const { id } = req.body;

  try {
    await findUserAndUpdate(id, req.body);
    const userInfo = await findUseById(id);

    global.io && socket("user");

    res.status(200).json(userInfo);
  } catch (error) {
    res.status(400).json(error);
  }
};

const getInfo = async (req, res) => {
  try {
    const userInfo = await findUser(req.body);

    res.status(200).json(userInfo);
  } catch (error) {
    res.status(400).json(error);
  }
};

module.exports = { onPhoneAuth, updateInfo, getInfo };
