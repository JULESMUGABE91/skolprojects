// ========================================
// Author: Didier Kibugenza
// Email: kibugenzad@gmail.com
// version: 1.0
// ========================================

const {
  findRespondent,
  createRespondentInfo,
} = require("../../model/respondent/respondent.model");

const addInfo = async (req, res) => {
  const { organization, survey } = req.body;

  const user = req.user.id;

  const { error } = validateQuestion({
    survey,
    organization,
    user,
  });

  if (error) return res.status(400).json({ error: error.details[0].message });
  try {
    const respondentInfo = await createRespondentInfo({
      addedBy: user,
      ...req.body,
    });

    global.io && socket("respondent");

    res.status(200).json(respondentInfo);
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};

const getInfo = async (req, res) => {
  try {
    const respondentInfo = await findRespondent(req.body);

    res.status(200).json(respondentInfo);
  } catch (error) {
    console.log("====================================");
    console.log(error.stack);
    console.log("====================================");
    res.status(400).json(error);
  }
};

module.exports = {
  getInfo,
};
