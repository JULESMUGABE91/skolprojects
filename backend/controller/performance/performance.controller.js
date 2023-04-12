// ========================================
// Author: Didier Kibugenza
// Email: kibugenzad@gmail.com
// version: 1.0
// ========================================

const {
  fetchSurveyorPerformance,
  fetchSingleSurveyorPerformance,
} = require("../../model/performance/performance.model");
const {
  validateSurveyorPerformance,
} = require("../../validation/performance.validation.js");

const httpSurveyorPerformance = async (req, res) => {
  const { start_date, end_date, organization } = req.body;

  const { error } = validateSurveyorPerformance({
    start_date,
    end_date,
    organization,
  });

  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    const info = await fetchSurveyorPerformance(req.body);

    res.status(200).json(info);
  } catch (error) {
    res.status(400).json(error.stack);
  }
};

const httpSingleSurveyorPerformance = async (req, res) => {
  const { start_date, end_date, organization } = req.body;

  const { error } = validateSurveyorPerformance({
    start_date,
    end_date,
    organization,
  });

  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    const info = await fetchSingleSurveyorPerformance(req.body);

    res.status(200).json(info);
  } catch (error) {
    res.status(400).json(error.stack);
  }
};

module.exports = {
  httpSurveyorPerformance,
  httpSingleSurveyorPerformance,
};
