// ========================================
// Author: Didier Kibugenza
// Email: kibugenzad@gmail.com
// version: 1.0
// ========================================

const { fetchResponses } = require("../../model/answer/responses.model");

const httpFetchInfo = async (req, res) => {
  try {
    const resInfo = await fetchResponses(req.body);

    res.status(200).json(resInfo);
  } catch (error) {
    res.status(400).json(error.stack);
  }
};

module.exports = {
  httpFetchInfo,
};
