const { isValidObjectId, default: mongoose } = require("mongoose");
const { gender, regions } = require("../../constant/string");
const questionMongo = require("../question/question.mongo");
const { createReward, findReward } = require("../reward/reward.model");
const surveyMongo = require("../survey/survey.mongo");
const userMongo = require("../users/user.mongo");
const answerMongo = require("./answer.mongo");
const { findQuestion } = require("../question/question.model");
const { Parser } = require("json2csv");
const fs = require("fs");

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
    identifiers,
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

  if (identifiers) {
    filters.identifier = { $in: identifiers };
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
  try {
    return await answerMongo
      .find({
        ...answerCommonFilters(params),
      })
      .populate({ path: "survey", model: surveyMongo, select: { title: 1 } })
      .populate({
        path: "question",
        model: questionMongo,
        select: { question: 1, type: 1, options: 1, english_question: 1 },
      })
      .populate({
        path: "user",
        model: userMongo,
        select: { firstname: 1, lastname: 1 },
      })
      .lean()
      .select({ survey: 1, question: 1, user: 1, answers: 1 });
  } catch (error) {
    return error;
  }
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
  try {
    const total_respondent = await fetchRespondents(params);

    const question_answers = await getQuestionAnswers(params, total_respondent);

    return question_answers;
  } catch (error) {
    console.log("====================================");
    console.log(error.stack);
    console.log("====================================");
    return error.stack;
  }
};

const getQuestionAnswers = async (params, total_respondent) => {
  let answers = {},
    question_ids = [];

  let questions = await questionMongo.find(
    {
      $or: [
        {
          question: params.questionName,
        },
        {
          english_question: params.questionName,
        },
        {
          question: params.questionName + " ",
        },
        {
          english_question: params.questionName + " ",
        },
      ],
    },
    { _id: 1 }
  );

  if (questions.length > 0) {
    for (let el of questions) {
      question_ids.push(el._id);
    }
  } else {
    return "Not found";
  }

  const data = await findAnswerNormal({
    ...params,
    identifiers: total_respondent.data,
    questions: question_ids,
  });

  for (let item of data) {
    const question = (
      item.question.english_question
        ? item.question.english_question
        : item?.question?.question
    )
      .trim()
      .replace(/ /g, "_");

    if (question) {
      if (!answers[question]) {
        answers[question] = {};
      }

      for (let option of item?.question?.options || []) {
        const key_option = (option.option_english || option.option).trim();

        for (let answer of item.answers) {
          const answer_option = answer.option;

          if (!answers[question][key_option]) {
            answers[question][key_option] = {
              count: 0,
            };
          }

          if (answer_option === option.option || key_option === answer_option) {
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

                if (
                  answers[question][key_option]["data"][selection.value][
                    "count"
                  ] <= total_respondent.total
                ) {
                  answers[question][key_option]["data"][selection.value][
                    "count"
                  ] += 1;
                }

                break;
              }
            } else {
              answers[question][key_option]["count"] += 1;
            }
          }

          if (!answer.selection) break;
        }
      }
    }

    answers[question] = percentagePerAnswer(
      question,
      answers[question],
      total_respondent
    );
  }

  console.log("====================================");
  console.log("Done!");
  console.log("====================================");

  return answers;
};

const percentagePerAnswer = (question, answers, total_respondent) => {
  for (let el of Object.keys(answers)) {
    let count = answers[el].count;

    answers[el]["percentage"] = parseFloat(
      ((count / total_respondent.total) * 100).toFixed(2)
    );
  }

  return answers;
};

const fetchRespondents = async (params) => {
  const respondent = await answerMongo.aggregate(
    [
      {
        $match: {
          ...answerCommonFilters(params),
        },
      },
      {
        $group: {
          _id: "$identifier",
          count: { $sum: 1 },
        },
      },
      {
        $match: {
          count: { $eq: 33 },
        },
      },
      {
        $group: {
          _id: null,
          ids: { $push: "$_id" },
        },
      },
      {
        $project: {
          _id: 0,
          ids: { $map: { input: "$ids", as: "id", in: { $toString: "$$id" } } },
        },
      },
    ],
    { allowDiskUse: true }
  );
  return {
    total: respondent[0].ids.length,
    data: respondent[0].ids,
  };
};

const fetchRespondentsByGender = async (params) => {
  try {
    let groupGender = {},
      total_respondent = await fetchRespondents(params);

    for (let el of gender) {
      const genderData = await answerMongo.aggregate([
        {
          $match: {
            identifier: { $in: total_respondent.data },
            $or: [
              {
                "answers.option": el.label + " ",
              },
              {
                "answers.option": el.label,
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

      if (!groupGender[el.value]) {
        groupGender[el.value] = {
          count: genderData.length,
        };
      } else {
        groupGender[el.value]["count"] += genderData.length;
      }
    }

    for (let el of Object.keys(groupGender)) {
      groupGender[el]["percentage"] = Math.round(
        (groupGender[el].count / total_respondent.total) * 100
      );
    }

    return groupGender;
  } catch (error) {
    return error;
  }
};

const fetchRespondentsByRegion = async (params) => {
  try {
    let groupRegion = {},
      total_respondent = await fetchRespondents(params);

    for (let el of regions) {
      const regionData = await answerMongo.aggregate([
        {
          $match: {
            identifier: { $in: total_respondent.data },
            $or: [
              {
                "answers.option": el.label + " ",
              },
              {
                "answers.option": el.label,
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

      if (!groupRegion[el.value]) {
        groupRegion[el.value] = {
          count: regionData.length,
        };
      } else {
        groupRegion[el.value]["count"] += regionData.length;
      }
    }

    for (let el of Object.keys(groupRegion)) {
      groupRegion[el]["percentage"] = Math.round(
        (groupRegion[el].count / total_respondent.total) * 100
      );
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
              identifier: { $in: total_respondent.data },
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

        if (groupData.length !== 0) {
          if (!groupAgeGroup[el]) {
            groupAgeGroup[el] = {
              count: groupData.length,
            };
          } else {
            groupAgeGroup[el]["count"] += groupData.length;
          }
        }
      }
    }

    for (let el of Object.keys(groupAgeGroup)) {
      groupAgeGroup[el]["percentage"] = Math.round(
        (groupAgeGroup[el].count / total_respondent.total) * 100
      );
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
    const data = await answerMongo.aggregate(
      [
        {
          $match: {
            ...answerCommonFilters(params),
          },
        },
        {
          $group: {
            _id: "$identifier",
            count: { $sum: 1 },
          },
        },
        {
          $match: {
            count: { $lt: 33 },
          },
        },
        {
          $group: {
            _id: null,
            ids: { $push: "$_id" },
          },
        },
        {
          $project: {
            _id: 0,
            ids: {
              $map: { input: "$ids", as: "id", in: { $toString: "$$id" } },
            },
          },
        },
      ],
      { allowDiskUse: true }
    );

    return data.length > 0 ? data[0].ids.length : 0;
  } catch (error) {
    return error.stack;
  }
};

const fetchIncompleteResponses = async (params) => {
  const { page, limit } = params;
  try {
    let skip = limit * (page - 1);

    delete params.status;
    const incomplete = await answerMongo.aggregate([
      {
        $match: {
          ...answerCommonFilters(params),
        },
      },
      {
        $group: {
          _id: "$identifier",
          count: { $sum: 1 },
          doc: { $first: "$$ROOT" },
        },
      },
      {
        $match: {
          count: { $lt: 33 },
        },
      },
      { $replaceRoot: { newRoot: "$doc" } },
      { $skip: skip },
      { $limit: limit },
    ]);

    return {
      data: incomplete,
      totalCount: "many",
    };
  } catch (error) {
    console.log(error);
  }
};

const fetchResponses = async (params) => {
  const { page, limit } = params;

  let skip = limit * (page - 1);

  try {
    const answers = await answerMongo.aggregate(
      [
        {
          $match: {
            ...answerCommonFilters(params),
            status: { $ne: "incomplete" },
          },
        },
        {
          $lookup: {
            from: "questions",
            localField: "question",
            foreignField: "_id",
            as: "question",
          },
        },
        {
          $unwind: "$question",
        },
        {
          $lookup: {
            from: "users",
            localField: "user",
            foreignField: "_id",
            as: "user",
          },
        },
        {
          $unwind: "$user",
        },
        {
          $group: {
            _id: {
              identifier: "$identifier",
              user: "$user",
            },
            answers: {
              $push: {
                start_interview: "$start_interview",
                end_interview: "$end_interview",
                option: "$answers.option",
                value: "$answers.value",
                selection: "$answers.selection",
                question: {
                  $cond: {
                    if: { $gt: ["$question.english_question", null] },
                    then: "$question.english_question",
                    else: "$question.question",
                  },
                },
                questionType: "$question.type",
                questionOptions: "$question.options",
              },
            },
          },
        },
        {
          $project: {
            _id: 0,
            identifier: "$_id.identifier",
            user: {
              firstname: "$_id.user.firstname",
              lastname: "$_id.user.lastname",
              phone: "$_id.user.phone",
            },
            answers: 1,
          },
        },
        {
          $skip: skip,
        },
        {
          $limit: limit,
        },
      ],
      { allowDiskUse: true }
    );

    const expected_result = answers.map((obj) => {
      const userResult = {
        identifier: obj.identifier,
      };
      obj.answers.forEach((answer) => {
        for (let option of answer.option) {
          let keyOption = "",
            question = answer.question.replace(/[^a-zA-Z0-9]/g, "_");

          for (let questionOption of answer.questionOptions) {
            if (
              questionOption.option_english === option ||
              questionOption.option === option
            ) {
              keyOption = (
                questionOption.option_english || questionOption.option
              ).replace(/[^a-zA-Z0-9]/g, "_");

              break;
            }
          }

          if (answer.value && answer.value.length > 0) {
            for (let value of answer.value) {
              userResult[question] = value;
            }
          } else if (answer.selection && answer.selection.length > 0) {
            for (let selectionOption of answer.selection) {
              for (let selectionOptionOption of selectionOption) {
                userResult[keyOption] = selectionOptionOption.value;
              }
            }
          } else {
            userResult[question] = keyOption;
          }
        }
      });
      return userResult;
    });

    const fields = [
      ...new Set(expected_result.flatMap((obj) => Object.keys(obj))),
    ];

    return {
      data: expected_result,
      headers: fields,
      totalCount: "many",
    };
  } catch (error) {
    return error.stack;
  }
};

const fetchClosedInterviews = async (params) => {
  const { page, limit } = params;

  let skip = limit * (page - 1);

  try {
    const answers = await answerMongo
      .find({
        $or: [
          { "answers.option": "Hashize ukwezi kurenga" },
          { "answers.option": "More than a month ago" },
        ],
      })
      .skip(skip)
      .limit(limit);
    const counts = await answerMongo
      .find({
        $or: [
          { "answers.option": "Hashize ukwezi kurenga" },
          { "answers.option": "More than a month ago" },
        ],
      })
      .count();

    let data = {};

    return {
      data: answers,
      totalCount: counts,
    };
  } catch (error) {
    return error.stack;
  }
};

const generateResponseReport = async (params) => {
  try {
    const { data, headers } = await fetchResponses(params);
    const json2csvParser = new Parser({ fields: headers });
    const csv = json2csvParser.parse(data);

    const filePath =
      __dirname +
      "/../../reports/csv/" +
      new Date().getTime() +
      "_surveyResponses.csv";
    return new Promise((resolve, reject) => {
      fs.writeFile(filePath, csv, (err) => {
        if (err) {
          console.error("Error saving CSV file:", err);
          reject({ error: err });
        } else {
          const successMessage = "CSV file saved successfully!";
          console.log(successMessage);

          resolve({
            message: successMessage,
            filePath,
          });
        }
      });
    });
  } catch (error) {
    return error;
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
  fetchIncompleteResponses,
  fetchClosedInterviews,
  generateResponseReport,
};
