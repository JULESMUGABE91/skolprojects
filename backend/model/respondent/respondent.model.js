const { findAnswer } = require("../answer/answer.model");
const respondentSchema = require("../respondent/respondent.mongo");

const createRespondentInfo = async (params) => {
  try {
    const { email, phone_number } = params;
    const exists = await findRespondent({ email, phone_number });
    if (exists.length === 0) {
      return await respondentSchema.create(params);
    }
  } catch (error) {
    console.log({ res: error });
  }
};

const findRespondent = async (params) => {
  let { organization, survey, question, email, phone_number } = params,
    filters = {};

  if (organization) {
    filters.organization = organization;
  }

  if (survey) {
    filters.survey = survey;
  }

  if (question) {
    filters.question = question;
  }

  if (phone_number && phone_number !== "") {
    filters.phone_number = phone_number;
  }

  if (email && email !== "") {
    filters.email = email;
  }
  return await respondentSchema.find(params);
};

module.exports = {
  findRespondent,
  createRespondentInfo,
};
