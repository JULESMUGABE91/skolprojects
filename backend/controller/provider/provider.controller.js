// ========================================
// Author: Didier Kibugenza
// Email: kibugenzad@gmail.com
// version: 1.0
// ========================================

const {
  createProvider,
  findProvider,
  findProviderAndUpdate,
} = require("../../model/provider/provider.model");
const socket = require("../../utils/socket");

const { validateProvider } = require("../../validation/provider.validation.js");

const addInfo = async (req, res) => {
  const { name, organization } = req.body;

  let createdBy = req.user.id;

  const { error } = validateProvider({
    name,
    createdBy,
    organization,
  });

  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    const providerInfo = await createProvider({
      createdBy,
      ...req.body,
    });

    if (providerInfo.error) return res.status(400).json(providerInfo);

    global.io && socket("provider");

    res.status(200).json(providerInfo);
  } catch (error) {
    res.status(400).json(error);
  }
};

const updateInfo = async (req, res) => {
  const { id } = req.body;

  try {
    const providerInfo = await findProviderAndUpdate(id, req.body);

    global.io && socket("provider");

    res.status(200).json(providerInfo);
  } catch (error) {
    res.status(400).json(error);
  }
};

const deleteInfo = async (req, res) => {
  const { id } = req.body;

  try {
    const providerInfo = await findProviderAndDelete(id);

    global.io && socket("provider");

    res.status(200).json(providerInfo);
  } catch (error) {
    res.status(400).json(error);
  }
};

const fetchInfo = async (req, res) => {
  try {
    const providerInfo = await findProvider(req.query);

    res.status(200).json(providerInfo);
  } catch (error) {
    res.status(400).json(error.stack);
  }
};

module.exports = {
  addInfo,
  deleteInfo,
  updateInfo,
  fetchInfo,
};
