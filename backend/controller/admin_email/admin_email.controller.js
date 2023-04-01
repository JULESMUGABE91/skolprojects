// ========================================
// Author: Didier Kibugenza
// Email: kibugenzad@gmail.com
// version: 1.0
// ========================================

const {
  createAdminEmail,
  findAdminEmailAndUpdate,
  findAdminEmailById,
  findAdminEmail,
  findAdminEmailAndDelete,
} = require("../../model/admin_email/admin_email.model");
const {
  validateAdminEmail,
} = require("../../validation/admin_email.validation.js");
const socket = require("../../utils/socket");

const httpCreate = async (req, res) => {
  const { email, organization } = req.body;

  const { error } = validateAdminEmail({
    email,
    organization,
  });

  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    const adminInfo = await createAdminEmail(req.body);

    global.io && socket("admin_email", adminInfo);

    res.status(200).json(adminInfo);
  } catch (error) {
    res.status(400).json(error.stack);
  }
};

const httpUpdateInfo = async (req, res) => {
  const { id } = req.body;

  try {
    await findAdminEmailAndUpdate(id, req.body);
    const adminInfo = await findAdminEmailById(id);

    global.io && socket("admin_email");

    res.status(200).json(adminInfo);
  } catch (error) {
    res.status(400).json(error);
  }
};

const httpGetInfo = async (req, res) => {
  try {
    const adminInfo = await findAdminEmail(req.body);

    res.status(200).json(adminInfo);
  } catch (error) {
    res.status(400).json(error);
  }
};

const httpDeleteInfo = async (req, res) => {
  const { id } = req.body;

  try {
    await findAdminEmailAndDelete(id, req.body);
    const adminInfo = await findAdminEmailById(id);

    global.io && socket("admin_email");

    res.status(200).json(adminInfo);
  } catch (error) {
    res.status(400).json(error);
  }
};

module.exports = { httpCreate, httpUpdateInfo, httpGetInfo, httpDeleteInfo };
