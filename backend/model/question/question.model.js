const { isValidObjectId } = require("mongoose");
const surveyMongo = require("../survey/survey.mongo");
const questionMongo = require("./question.mongo");
const organizationMongo = require("../organization/organization.mongo");

const createQuestion = async (params) => {
  const { id } = params;

  const checkQuestion = await findQuestionById(id);

  if (checkQuestion && checkQuestion._id) {
    await findAndUpdateQuestion(checkQuestion._id, params);
    await findQuestionById(checkQuestion._id);
  } else {
    delete params._id;
    return await questionMongo.create(params);
  }
};

const findAndUpdateQuestion = async (_id, params) => {
  return await questionMongo.findByIdAndUpdate({ _id }, params);
};

const findAndDeleteQuestion = async (_id) => {
  return await questionMongo.findByIdAndDelete({ _id });
};

const findQuestion = async (params) => {
  const { id, survey, user, organization } = params;
  let filters = {};

  if (id) {
    filters._id = id;
  }

  if (survey) {
    filters.survey = survey;
  }

  if (user) {
    filters.user = user;
  }

  if (organization) {
    filters.organization = organization;
  }

  return await questionMongo
    .find(filters)
    .populate({
      path: "organization",
      model: organizationMongo,
      select: { name: 1 },
    })
    .populate({
      path: "survey",
      model: surveyMongo,
      select: { title: 1 },
    });
};

const findQuestionById = async (_id) => {
  if (!_id || !isValidObjectId(_id)) return;

  return await questionMongo.findById({ _id });
};

module.exports = {
  createQuestion,
  findAndUpdateQuestion,
  findAndDeleteQuestion,
  findQuestion,
  findQuestionById,
};
