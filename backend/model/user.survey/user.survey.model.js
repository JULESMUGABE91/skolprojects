const userSurveyMongo = require("./user.survey.mongo");
const surveyMongo = require("../survey/survey.mongo");

const createUserAnsweredSurvey = async (params) => {
  const { organization, survey, user } = params;
  let checkExist = await findUserSurvey({
    survey,
    organization,
    user,
  });

  if (checkExist.length === 0) return await userSurveyMongo.create(params);
};

const findAndUpdateUserSurvey = async (_id, params) => {
  return await userSurveyMongo.findByIdAndUpdate({ _id }, params);
};

const findAndDeleteUserSurvey = async (_id) => {
  return await userSurveyMongo.findByIdAndDelete({ _id });
};

const findUserSurvey = async (params) => {
  const { id, user, organization, survey, start_date, end_date } = params;
  let filters = {};
  console.log(params);

  if (id) {
    filters._id = id;
  }

  if (user) {
    filters.user = user;
  }

  if (organization) {
    filters.organization = organization;
  }

  if (survey) {
    filters.survey = survey;
  }

  if (start_date && end_date) {
    filters.createdAt = {
      $gte: new Date(start_date),
      $lt: new Date(end_date),
    };
  }

  return await userSurveyMongo
    .find(filters)
    .populate({ path: "survey", model: surveyMongo })
    .sort({ createdAt: -1 });
};

const findUserSurveyById = async (_id) => {
  return await userSurveyMongo.findById({ _id });
};

module.exports = {
  createUserAnsweredSurvey,
  findAndUpdateUserSurvey,
  findAndDeleteUserSurvey,
  findUserSurvey,
  findUserSurveyById,
};
