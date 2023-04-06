const { default: mongoose } = require("mongoose");
const { findAnswer } = require("../answer/answer.model");
const answerMongo = require("../answer/answer.mongo");
const { findUser } = require("../users/users.model");
const userMongo = require("../users/user.mongo");
const questionMongo = require("../question/question.mongo");

const fetchSurveyorPerformance = async (params) => {
  const { account_type, organization, start_date, end_date, page, limit } =
    params;

  let performance = {},
    resultArray = [],
    user_ids = [],
    answerFilters = {},
    commonFilters = {};

  if (organization) {
    commonFilters.organization = mongoose.Types.ObjectId(organization);
  }

  if (account_type) {
    commonFilters.account_type = account_type;
  }

  if (start_date && end_date) {
    answerFilters.createdAt = {
      $gte: new Date(start_date),
      $lt: new Date(end_date),
    };
  }

  const users = await findUser({ account_type, organization, page, limit });

  for (let user of users.data) {
    user_ids.push(user._id);
  }

  const answers = await answerMongo
    .find(
      { user: { $in: user_ids }, ...answerFilters, ...commonFilters },
      {
        identifier: 1,
        question: 1,
        user: 1,
        createdAt: 1,
        status: 1,
        user: 1,
        survey: 1,
        last_question: 1,
      }
    )
    .populate({
      path: "user",
      model: userMongo,
      select: { firstname: 1, lastname: 1 },
    })
    .sort({ createdAt: -1 });

  let group_by_user = {};

  for (let answer of answers) {
    if (!group_by_user[answer.user._id]) {
      group_by_user[answer.user._id] = {
        user: {
          firstname: answer.user.firstname,
          lastname: answer.user.lastname,
        },
        data: {},
      };
    }

    if (!group_by_user[answer.user._id]["data"][answer.identifier]) {
      const totalQuestions = await countQuestionsPerSurvey(answer.survey);

      group_by_user[answer.user._id]["data"][answer.identifier] = {
        total: 0,
        totalQuestions: totalQuestions,
      };

      if (
        group_by_user[answer.user._id]["data"][answer.identifier].total <
        group_by_user[answer.user._id]["data"][answer.identifier].totalQuestions
      ) {
        group_by_user[answer.user._id]["data"][
          answer.identifier
        ].incomplete = 0;
        group_by_user[answer.user._id]["data"][answer.identifier].lastQuestion =
          answer.last_question;
        group_by_user[answer.user._id]["data"][answer.identifier].createdAt =
          answer.createdAt;
      }
    }

    console.log(
      group_by_user[answer.user._id]["data"][answer.identifier].total
    );

    //don't count duplicates
    if (
      group_by_user[answer.user._id]["data"][answer.identifier].total <
      group_by_user[answer.user._id]["data"][answer.identifier].totalQuestions
    ) {
      group_by_user[answer.user._id]["data"][answer.identifier].total += 1;

      if (answer.status === "incomplete") {
        group_by_user[answer.user._id]["data"][answer.identifier][
          "incomplete"
        ] += 1;
      }
    }
  }

  let user_performance = [];

  for (let user of Object.keys(group_by_user)) {
    const questionnaires = group_by_user[user].data;

    user_performance.push({
      ...group_by_user[user].user,
      questionnaires,
      respondents: Object.keys(questionnaires)?.length || 0,
    });
  }

  return user_performance;
};

const countQuestionsPerSurvey = async (survey) => {
  return await questionMongo.find({ survey }).count();
};

module.exports = {
  fetchSurveyorPerformance,
};
