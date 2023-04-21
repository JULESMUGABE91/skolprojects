const { default: mongoose } = require("mongoose");
const answerMongo = require("../answer/answer.mongo");
const userMongo = require("../users/user.mongo");
const questionMongo = require("../question/question.mongo");

const fetchSurveyorPerformance = async (params) => {
  const { account_type, organization, start_date, end_date, user } = params;
  let user_ids = [],
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

  if (user) {
    commonFilters.user = mongoose.Types.ObjectId(user);
  }

  const answers = await answerMongo.aggregate([
    { $match: commonFilters },
    { $group: { _id: "$identifier", doc: { $first: "$$ROOT" } } },
    { $replaceRoot: { newRoot: "$doc" } },
    { $group: { _id: "$user", count: { $sum: 1 } } },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "user_info",
      },
    },
    {
      $project: {
        _id: 1,
        count: 1,
        user_info: { $arrayElemAt: ["$user_info", 0] },
      },
    },
    { $sort: { count: -1 } },
  ]);

  return answers;

  //   .find(
  //     { user: { $in: user_ids }, ...answerFilters, ...commonFilters },
  //     {
  //       identifier: 1,
  //       question: 1,
  //       user: 1,
  //       createdAt: 1,
  //       status: 1,
  //       user: 1,
  //       survey: 1,
  //       last_question: 1,
  //     }
  //   )
  //   .populate({
  //     path: "user",
  //     model: userMongo,
  //     select: { firstname: 1, lastname: 1, _id: 1, phone: 1 },
  //   })
  //   .sort({ createdAt: -1 });

  // let group_by_user = {};

  // for (let answer of answers) {
  //   if (!group_by_user[answer.user._id]) {
  //     group_by_user[answer.user._id] = {
  //       user: {
  //         firstname: answer.user.firstname,
  //         lastname: answer.user.lastname,
  //         phone: answer.user.phone,
  //         _id: answer.user._id,
  //       },
  //       data: {},
  //     };
  //   }

  //   if (!group_by_user[answer.user._id]["data"][answer.identifier]) {
  //     group_by_user[answer.user._id]["data"][answer.identifier] = {
  //       total: 0,
  //       incomplete: 0,
  //       last_question: answer.last_question,
  //       createdAt: answer.createdAt,
  //       survey: answer.survey,
  //     };
  //   }

  //   group_by_user[answer.user._id]["data"][answer.identifier].total += 1;

  //   if (answer.status === "incomplete") {
  //     group_by_user[answer.user._id]["data"][answer.identifier][
  //       "incomplete"
  //     ] += 1;
  //   }
  // }

  // let user_performance = [];

  // for (let user of Object.keys(group_by_user)) {
  //   const questionnaires = group_by_user[user].data;

  //   user_performance.push({
  //     ...group_by_user[user].user,
  //     questionnaires,
  //     respondents: Object.keys(questionnaires)?.length || 0,
  //   });
  // }

  // return {
  //   data: user_performance,
  //   count: users.count,
  // };
};

const fetchSingleSurveyorPerformance = async (params) => {
  const { organization, start_date, end_date, page, limit, user } = params;
  let answerFilters = {},
    commonFilters = {};

  if (organization) {
    commonFilters.organization = mongoose.Types.ObjectId(organization);
  }

  if (start_date && end_date) {
    answerFilters.createdAt = {
      $gte: new Date(start_date),
      $lt: new Date(end_date),
    };
  }

  let skip = limit * (page - 1);

  const answers = await answerMongo
    .find(
      { user: user, ...answerFilters, ...commonFilters },
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
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  let group_by_identifier = {};
  for (let answer of answers) {
    if (!group_by_identifier[answer.identifier]) {
      const totalQuestions = await countQuestionsPerSurvey(answer.survey);
      group_by_identifier[answer.identifier] = {
        total: 0,
        incomplete: 0,
        totalQuestions,
        last_question: answer.last_question,
        survey: answer.survey,
        createdAt: answer.createdAt,
      };
    }

    group_by_identifier[answer.identifier].total += 1;

    if (answer.status === "incomplete") {
      group_by_identifier[answer.identifier]["incomplete"] += 1;
    }
  }

  return {
    data: group_by_identifier,
    count: "many",
  };
};

const countQuestionsPerSurvey = async (survey) => {
  return await questionMongo.find({ survey }).count();
};

module.exports = {
  fetchSurveyorPerformance,
  fetchSingleSurveyorPerformance,
};
