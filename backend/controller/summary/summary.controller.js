// ========================================
// Author: Didier Kibugenza
// Email: kibugenzad@gmail.com
// version: 1.0
// ========================================

const { fetchRegionPerGender } = require("../../model/summary/regionGender");
const {
  fetchRegionGenderAgeGroup,
} = require("../../model/summary/regionGenderAgeGroup");

const httpRegionGender = async (req, res) => {
  try {
    const dataInfo = await fetchRegionPerGender(req.body);

    res.status(200).json(dataInfo);
  } catch (error) {
    res.status(400).json(error.stack);
  }
};

const httpRegionGenderAgeGroup = async (req, res) => {
  try {
    const dataInfo = await fetchRegionGenderAgeGroup(req.body);

    res.status(200).json(dataInfo);
  } catch (error) {
    res.status(400).json(error.stack);
  }
};

module.exports = {
  httpRegionGenderAgeGroup,
  httpRegionGender,
};
