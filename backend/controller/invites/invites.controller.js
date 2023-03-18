// ========================================
// Author: Didier Kibugenza
// Email: kibugenzad@gmail.com
// version: 1.0
// ========================================

const { findInvite } = require("../../model/invites/invites.model");

const fetchInfo = async (req, res) => {
  try {
    const invitesInfo = await findInvite(req.query);

    res.status(200).json(invitesInfo);
  } catch (error) {
    res.status(400).json(error);
  }
};

module.exports = {
  fetchInfo,
};
