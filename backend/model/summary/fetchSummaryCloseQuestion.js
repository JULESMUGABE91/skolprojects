const { default: mongoose } = require("mongoose");
const closeQuestionAnswerMongo = require("../closeQuestionAnswer/closeQuestionAnswer.mongo");
const questionMongo = require("../question/question.mongo");
const surveyMongo = require("../survey/survey.mongo");

const returnFilters = (params) => {
  let {
    id,
    question,
    survey,
    sort = { createdAt: -1 },
    organization,
    start_date,
    end_date,
    type,
  } = params;
  let filters = {};

  if (id) {
    filters._id = id;
  }

  if (question) {
    filters.question = mongoose.Types.ObjectId(question);
  }

  if (survey) {
    filters.survey = mongoose.Types.ObjectId(survey);
  }

  if (start_date && end_date) {
    filters.createdAt = {
      $gte: new Date(start_date),
      $lt: new Date(end_date),
    };
  }

  if (type) {
    filters.questionType = type;
  }

  if (organization) {
    filters.organization = mongoose.Types.ObjectId(organization);
  }

  return filters;
};

module.exports = async (params) => {
  const { limit = 50, page = 1 } = params;
  try {
    let skip = limit * (page - 1),
      filters = returnFilters(params);

    const data = await closeQuestionAnswerMongo
      .find(filters)
      .populate({
        path: "question",
        model: questionMongo,
        select: { question: 1 },
      })
      .populate({
        path: "survey",
        model: surveyMongo,
        select: { title: 1 },
      })
      .sort({ count: -1 })
      .skip(skip)
      .limit(limit);

    // const total = await closeQuestionAnswerMongo.find(filters).count();

    return { data, totalCount: "many" };
  } catch (error) {
    return error;
  }
};
