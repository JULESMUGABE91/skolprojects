const userMongo = require("../users/user.mongo");
const surveyMongo = require("./survey.mongo");

const createSurvey = async (params) => {
  return await surveyMongo.create(params);
};

const findAndUpdateSurvey = async (_id, params) => {
  return await surveyMongo.findByIdAndUpdate({ _id }, params);
};

const findAndDeleteSurvey = async (_id) => {
  return await surveyMongo.findByIdAndDelete({ _id });
};

const findSurvey = async (params) => {
  const { id, exclude_surveys, organization } = params;
  let filters = {};

  if (id) {
    filters._id = id;
  }

  if (organization) {
    filters.organization = organization;
  }

  if (exclude_surveys) {
    filters._id = {
      nin: exclude_surveys,
    };
  }

  return await surveyMongo
    .find(filters)
    .populate({
      path: "user",
      model: userMongo,
      select: { firstname: 1, lastname: 1 },
    })
    .sort({ createdAt: -1 });
};

const findSurveyById = async (_id) => {
  return await surveyMongo.findById({ _id });
};

module.exports = {
  createSurvey,
  findAndUpdateSurvey,
  findAndDeleteSurvey,
  findSurvey,
  findSurveyById,
};
