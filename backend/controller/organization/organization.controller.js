// ========================================
// Author: Didier Kibugenza
// Email: kibugenzad@gmail.com
// version: 1.0
// ========================================

const {
  createOrganization,
  findAndDeleteOrganization,
  findAndUpdateOrganization,
  findOrganization,
} = require("../../model/organization/organization.model");
const socket = require("../../utils/socket");
const {
  validateOrganization,
} = require("../../validation/organization.validation.js");

const addInfo = async (req, res) => {
  const { name } = req.body;

  let createdBy = req.user.id;

  const { error } = validateOrganization({
    name,
    createdBy,
  });

  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    const organizationInfo = await createOrganization({
      createdBy,
      ...req.body,
    });

    if (organizationInfo.error) return res.status(400).json(organizationInfo);

    global.io && socket("organization");

    res.status(200).json(organizationInfo);
  } catch (error) {
    res.status(400).json(error);
  }
};

const updateInfo = async (req, res) => {
  const { id } = req.body;

  try {
    const organizationInfo = await findAndUpdateOrganization(id, req.body);

    global.io && socket("organization");

    res.status(200).json(organizationInfo);
  } catch (error) {
    res.status(400).json(error);
  }
};

const deleteInfo = async (req, res) => {
  const { id } = req.body;
  console.log(id);

  try {
    const organizationInfo = await findAndDeleteOrganization(id);

    global.io && socket("organization");

    res.status(200).json(organizationInfo);
  } catch (error) {
    res.status(400).json(error);
  }
};

const fetchInfo = async (req, res) => {
  try {
    const organizationInfo = await findOrganization(req.query);

    res.status(200).json(organizationInfo);
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
