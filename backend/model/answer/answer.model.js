const { isValidObjectId, default: mongoose } = require("mongoose");
const { gender, regions } = require("../../constant/string");
const questionMongo = require("../question/question.mongo");
const { createReward, findReward } = require("../reward/reward.model");
const surveyMongo = require("../survey/survey.mongo");
const userMongo = require("../users/user.mongo");
const answerMongo = require("./answer.mongo");
const { responderInfoFields } = require("../../constant/string");
const { findQuestion } = require("../question/question.model");

const createAnswer = async (params) => {
  delete params._id;

  const answerInfo = await answerMongo.create(params);

  const savedAnswer = await findAnswerById(answerInfo._id);

  markQuestion(savedAnswer.organization, savedAnswer.question, params.user);

  return savedAnswer;
};

const createBulkAnswer = async (params) => {
  try {
    const { questions, organization, survey, identifier, user } = params;

    delete params._id;

    let answers = [];

    for (let el of questions) {
      let answerInfo,
        checkAnswer = await findAnswer({
          organization,
          survey,
          identifier,
          user,
          question: el.question,
        });

      if (checkAnswer.length === 0) {
        answerInfo = await answerMongo.create({
          ...el,
          ...organization,
          survey,
          identifier,
          user,
        });
      } else {
        await findAndUpdateAnswer(checkAnswer[0]._id, { ...el });
      }

      const savedAnswer = await findAnswerById(answerInfo._id);

      // markQuestion(savedAnswer.organization, savedAnswer.question, params.user);

      answers.push(savedAnswer);
    }

    return answers;
  } catch (error) {
    console.log(error);
  }
};

const findAndUpdateAnswer = async (_id, params) => {
  return await answerMongo.findByIdAndUpdate({ _id }, params);
};

const findAndDeleteAnswer = async (_id) => {
  return await answerMongo.findByIdAndDelete({ _id });
};

const answerCommonFilters = (params) => {
  let {
    id,
    question,
    user,
    survey,
    sort = { createdAt: -1 },
    organization,
    start_date,
    end_date,
    questions,
    status,
    identifier,
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

  if (user) {
    filters.user = mongoose.Types.ObjectId(user);
  }

  if (identifier) {
    filters.identifier = identifier;
  }

  if (start_date && end_date) {
    filters.createdAt = {
      $gte: new Date(start_date),
      $lt: new Date(end_date),
    };
  }

  if (questions) {
    filters.question = {
      $in: questions,
    };
  }

  if (sort === "asc") {
    sort = { createdAt: 1 };
  }

  if (organization) {
    filters.organization = mongoose.Types.ObjectId(organization);
  }

  if (status) {
    filters.status = status;
  }
  return filters;
};

const findAnswer = async (params = {}) => {
  const answers = await answerMongo.aggregate(
    [
      { $sort: { createdAt: -1, "question.position": 1 } },
      { $match: answerCommonFilters(params) },
      {
        $group: {
          _id: {
            identifier: "$identifier",
            question: "$question",
            user: "$user",
          },
          dups: {
            $push: "$_id",
          },
          count: {
            $sum: 1,
          },
          doc: { $first: "$$ROOT" },
        },
      },
      {
        $match: {
          _id: {
            $ne: null,
          },
          count: {
            $eq: 1,
          },
        },
      },
      // { $sort: { ...sort, "question.position": 1 } },
      { $unwind: "$doc" },
      { $replaceRoot: { newRoot: "$doc" } },
    ],
    { allowDiskUse: true }
  );

  await answerMongo.populate(answers, {
    path: "survey",
    model: surveyMongo,
    select: { _id: 1, title: 1 },
  });
  await answerMongo.populate(answers, {
    path: "question",
    model: questionMongo,
    select: { question: 1, options: 1, _id: 1, type: 1 },
  });
  await answerMongo.populate(answers, {
    path: "user",
    model: userMongo,
    select: { firstname: 1, lastname: 1, phone: 1 },
  });

  return answers;
};

const findMySurvey = async (params) => {
  const { user } = params;

  let surveys = [],
    filters = {},
    survey_ids = [];

  if (user) {
    filters.user = user;
  }

  if (start_date && end_date) {
    filters.createdAt = {
      $gte: new Date(start_date),
      $lt: new Date(end_date),
    };
  }

  const answers = await answerMongo
    .find(filters)
    .populate({ path: "survey", model: surveyMongo })
    .populate({ path: "question", model: questionMongo })
    .sort({ createdAt: -1 });

  for (let answer of answers) {
    if (answer?.survey?._id && !survey_ids.includes(answer.survey._id)) {
      survey_ids.push(answer.survey._id);
      surveys.push(answer.survey);
    }
  }

  return surveys;
};

const findAnswerById = async (_id) => {
  if (!_id || !isValidObjectId(_id)) return;

  return await answerMongo
    .findById({ _id })
    .populate({ path: "question", model: questionMongo });
};
const findAnswerNormal = async (params) => {
  return await answerMongo
    .find(answerCommonFilters(params))
    .populate({ path: "survey", model: surveyMongo })
    .populate({ path: "question", model: questionMongo })
    .populate({
      path: "user",
      model: userMongo,
      select: { firstname: 1, lastname: 1 },
    });
};

const findAnswerByField = async (params) => {
  return await answerMongo
    .find(params)
    .populate({ path: "question", model: questionMongo, select: { type: 1 } });
};

const markQuestion = async (organization, question, user) => {
  let marks = 0;

  let question_point = question.point || 0,
    total_reward = 0;

  let fetch_user_reward = await findReward({ user, organization });

  if (fetch_user_reward.length > 0) {
    total_reward = fetch_user_reward[0].total_reward + question_point;
  } else {
    total_reward = question_point;
  }

  await createReward({
    user,
    total_reward,
    organization,
  });

  return marks;
};

const findAnswersFromSameLocation = async (params) => {
  const answers = await findAnswer(params);

  let same_location = [];

  for (let answer of answers) {
    if (answer?.start_location?.address === answer?.end_location?.address) {
      same_location.push(answer);
    }
  }

  return same_location;
};

const findAnswersFromDifferentLocation = async (params) => {
  const answers = await findAnswer(params);

  let different_location = [];

  for (let answer of answers) {
    if (answer?.start_location?.address !== answer?.end_location?.address) {
      different_location.push(answer);
    }
  }

  return different_location;
};

const findInsightAnswers = async (params) => {
  let answers = await findAnswerNormal({
    ...params,
  });

  const total_respondent = await fetchRespondents(params, answers);

  const question_answers = await getQuestionAnswers(answers, total_respondent);

  return question_answers;
};

const getQuestionAnswers = async (data, total_respondent) => {
  let answers = {};

  for (let item of data) {
    const question = item?.question?.question;
    const exclude = [
      "respondent_name",
      "respondent_address",
      "respondent_email",
      "respondent_phone_number",
      "respondent_id",
      "interviewer_name",
      "interviewer_id",
    ];

    if (question && !exclude.includes(item.question.type)) {
      if (!answers[question]) {
        answers[question] = {};
      }

      for (let option of item?.question?.options || []) {
        const key_option = option.option;

        if (!answers[question][key_option]) {
          answers[question][key_option] = {
            count: 0,
          };
        }

        for (let answer of item.answers) {
          const answer_option = answer.option;

          if (key_option === answer_option) {
            if (answer.selection) {
              answers[question]["question_type"] = "dropdown";
              answers[question]["total_respondent"] = total_respondent.total;
              for (let selection of answer.selection || []) {
                if (!answers[question][key_option]["data"]) {
                  answers[question][key_option]["data"] = {};
                }
                if (!answers[question][key_option]["data"][selection.value]) {
                  answers[question][key_option]["data"][selection.value] = {
                    count: 0,
                  };
                }

                answers[question][key_option]["data"][selection.value][
                  "count"
                ] += 1;
              }
            }

            answers[question][key_option]["count"] += 1;
          }
        }
      }

      answers[question] = percentagePerAnswer(
        answers[question],
        total_respondent
      );
    }
  }

  return answers;
};

const percentagePerAnswer = (answers, total_respondent) => {
  for (let el of Object.keys(answers)) {
    answers[el]["percentage"] = Math.round(
      (answers[el].count / total_respondent.total) * 100
    );
  }

  return answers;
};

const fetchRespondents = async (params) => {
  const respondent_ = await answerMongo.aggregate([
    { $match: { ...answerCommonFilters(params) } },
    {
      $group: {
        _id: "$identifier",
        uniqueValues: { $addToSet: "$identifier" },
      },
    },
    {
      $project: {
        _id: 0,
        fieldToGroupBy: "$_id",
        uniqueValues: 1,
      },
    },
  ]);
  return {
    total: respondent_.length,
  };
};

const fetchRespondentsByGender = async (params) => {
  let groupGender = {};

  for (let el of gender) {
    const genderData = await answerMongo.aggregate([
      {
        $match: {
          ...answerCommonFilters(params),
          $or: [
            {
              "answers.option": el.label + " ",
            },
            {
              "answers.option": el.label,
            },
            {
              "answers.option": el.value + " ",
            },
            {
              "answers.option": el.value,
            },
          ],
        },
      },
      {
        $group: {
          _id: "$identifier",
          uniqueValues: { $addToSet: "$identifier" },
        },
      },
      {
        $project: {
          _id: 0,
          fieldToGroupBy: "$_id",
          uniqueValues: 1,
        },
      },
    ]);

    let total_respondent = await fetchRespondents(params);

    groupGender[el.value] = {
      count: genderData.length,
      percentage: Math.round(
        (genderData.length / total_respondent.total) * 100
      ),
    };
  }

  return groupGender;
};

const fetchRespondentsByRegion = async (params) => {
  try {
    let groupRegion = {};

    for (let el of regions) {
      const regionData = await answerMongo.aggregate([
        {
          $match: {
            ...answerCommonFilters(params),
            $or: [
              {
                "answers.option": el.label + " ",
              },
              {
                "answers.option": el.label,
              },
              {
                "answers.option": el.value + " ",
              },
              {
                "answers.option": el.value,
              },
            ],
          },
        },
        {
          $group: {
            _id: "$identifier",
            uniqueValues: { $addToSet: "$identifier" },
          },
        },
        {
          $project: {
            _id: 0,
            fieldToGroupBy: "$_id",
            uniqueValues: 1,
          },
        },
      ]);

      let total_respondent = await fetchRespondents(params);

      groupRegion[el.value] = {
        count: regionData.length,
        percentage: Math.round(
          (regionData.length / total_respondent.total) * 100
        ),
      };
    }

    return groupRegion;
  } catch (error) {
    return error;
  }
};

const fetchRespondentsByAgeGroup = async (params) => {
  try {
    let questionFilters = {
      type: "respondent_age_group",
    };

    if (params.survey) {
      questionFilters.survey = params.survey;
    }
    const questionAgeGroup = await findQuestion(questionFilters);

    let groupAgeGroup = {},
      total_respondent = await fetchRespondents(params);

    let groupOptions = [];

    for (let el of questionAgeGroup) {
      for (let option of el.options) {
        if (!groupOptions.includes(option.option)) {
          groupOptions.push(option.option);
        }
      }
    }

    for (let el of groupOptions) {
      if (el !== "Enter your answer") {
        const groupData = await answerMongo.aggregate([
          {
            $match: {
              ...answerCommonFilters(params),
              "answers.option": el,
            },
          },
          {
            $group: {
              _id: "$identifier",
              uniqueValues: { $addToSet: "$identifier" },
            },
          },
          {
            $project: {
              _id: 0,
              fieldToGroupBy: "$_id",
              uniqueValues: 1,
            },
          },
        ]);

        groupAgeGroup[el] = {
          count: groupData.length,
          percentage: Math.round(
            (groupData.length / total_respondent.total) * 100
          ),
        };
      }
    }

    return groupAgeGroup;
  } catch (error) {
    console.log(error);
    return error;
  }
};

const fetchByStatus = async (params) => {
  const answersData = await answerMongo.find(answerCommonFilters(params)).count;

  return { count: answersData };
};

const fetchAndGroupByUser = async (params) => {
  const answersData = await answerMongo.aggregate([
    { $match: answerCommonFilters(params) },
    {
      $group: {
        _id: { identifier: "$identifier", user: "$user" },
        doc: { $first: "$$ROOT" },
      },
    },
    { $replaceRoot: { newRoot: "$doc" } },
  ]);

  await answerMongo.populate(answersData, { path: "user" });

  return answersData;
};

const fetchIncomplete = async (params) => {
  try {
    const answers = await findAnswer(params);
    let incomplete = [];

    for (let answer of answers) {
      if (!incomplete.includes(answer.identifier)) {
        incomplete.push(answer.identifier);
        // incomplete.push(answer.identifier);
        // const arr = await answerMongo.findByIdAndUpdate(
        //   { _id: answer._id },
        //   { user: "643e687b95edcc7df79e22e6" }
        // );
        // console.log(answer._id);
      }
    }
    return incomplete.length;
  } catch (error) {
    console.log(error);
  }
};

const fetchResponses = async (params) => {
  const { page, limit } = params;

  let skip = limit * (page - 1);

  try {
    const answers = await answerMongo.aggregate([
      {
        $lookup: {
          from: "questions",
          localField: "question",
          foreignField: "_id",
          as: "question",
        },
      },
      {
        $match: {
          ...answerCommonFilters(params),
          status: { $ne: "incomplete" },
          $and: [
            {
              $or: [
                {
                  ["question.type"]: "respondent_gender",
                },
                { ["question.type"]: "respondent_region" },
                {
                  ["question.type"]: "respondent_age_group",
                },
                {
                  ["question.type"]: "respondent_last_time_consumer",
                },
                {
                  ["question.type"]: "respondent_favorite",
                },
                {
                  ["question.type"]: "respondent_first_brand",
                },
              ],
            },
          ],
        },
      },
      {
        $project: {
          _id: 0,
          question: { $arrayElemAt: ["$question.question", 0] },
          answer: { $arrayElemAt: ["$answers.option", 0] },
        },
      },
      {
        $limit: limit,
      },
      {
        $skip: skip,
      },
    ]);
    return {
      data: answers,
      totalCount: "many",
    };
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  createAnswer,
  findAndUpdateAnswer,
  findAndDeleteAnswer,
  findAnswer,
  findAnswerById,
  findMySurvey,
  findAnswersFromSameLocation,
  findAnswersFromDifferentLocation,
  findInsightAnswers,
  fetchRespondents,
  createBulkAnswer,
  fetchRespondentsByGender,
  fetchRespondentsByRegion,
  fetchByStatus,
  fetchRespondentsByAgeGroup,
  fetchAndGroupByUser,
  fetchIncomplete,
  findAnswerNormal,
  findAnswerByField,
  fetchResponses,
};
