const { isValidObjectId, default: mongoose } = require("mongoose");
const { gender, regions } = require("../../constant/string");
const questionMongo = require("../question/question.mongo");
const { createReward, findReward } = require("../reward/reward.model");
const surveyMongo = require("../survey/survey.mongo");
const userMongo = require("../users/user.mongo");
const answerMongo = require("./answer.mongo");
const { findQuestion } = require("../question/question.model");
const { findSurvey } = require("../survey/survey.model");

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
  console.log(filters);

  return filters;
};

const findAnswer = async (params = {}) => {
  const answers = await answerMongo.aggregate([
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
  ]);

  await answerMongo.populate(answers, { path: "survey" });
  await answerMongo.populate(answers, { path: "question" });
  await answerMongo.populate(answers, {
    path: "user",
    model: userMongo,
    select: { firstname: 1, lastname: 1 },
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
    let answers = await findAnswerNormal({
      ...params,
    });

    const total_respondent = await fetchRespondents(params, answers);

    const question_answers = await getQuestionAnswers(
      answers,
      total_respondent
    );

    return question_answers;
  } catch (error) {
    console.log("====================================");
    console.log(error);
    console.log("====================================");
  }
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

const fetchRespondents = async (params, answers) => {
  let data = [];

  if (!answers) {
    answers = await findAnswer(params);
  }

  for (let answer of answers) {
    if (!data.includes(answer.identifier)) {
      data.push(answer.identifier);
    }
  }

  return {
    total: data.length,
  };
};

const getKey = (common, option) => {
  let key = "";
  let count = 0;
  for (let el of common) {
    let option_key = option.option.replace(" ", "").replace(" ", "");

    if (
      option_key?.toLowerCase() ===
      el?.label?.replace(" ", "").replace(" ", "").toLowerCase()
    ) {
      key = el.value;
    }
  }

  return key;
};

const fetchRespondentsByGender = async (params) => {
  const answersData = await findAnswer(params);

  let groupGender = {},
    total_respondent = await fetchRespondents(params, answersData);
  let identifiers = [];

  for (let el of answersData) {
    if (el.question && el.question.type === "respondent_gender") {
      const { answers } = el;

      identifiers.push(el.identifier);

      for (let option of answers) {
        const key = getKey(gender, option);

        if (!groupGender[key]) {
          groupGender[key] = {
            count: 0,
          };
        }

        groupGender[key].count += 1;
      }
    }
  }

  for (let key of Object.keys(groupGender)) {
    groupGender[key]["percentage"] = Math.round(
      (groupGender[key].count / total_respondent.total) * 100
    );
  }

  const toFindDuplicates = (identifiers) =>
    identifiers.filter((item, index) => identifiers.indexOf(item) !== index);
  console.log(toFindDuplicates(identifiers));

  return groupGender;
};

const fetchRespondentsByRegion = async (params) => {
  const answersData = await findAnswer(params);

  let groupRegion = {},
    total_respondent = await fetchRespondents(params, answersData);

  for (let el of answersData) {
    if (el.question && el.question.type === "respondent_region") {
      const { answers } = el;

      for (let region of el.question.options) {
        const key = getKey(regions, region);

        if (key && key !== "") {
          if (!groupRegion[key]) {
            groupRegion[key] = {
              count: 0,
            };
          }

          for (let option of answers) {
            if (option._id === region._id && option.option === region.option) {
              groupRegion[key].count += 1;
            }
          }
        }
      }
    }
  }

  for (let key of Object.keys(groupRegion)) {
    groupRegion[key]["percentage"] = Math.round(
      (groupRegion[key].count / total_respondent.total) * 100
    );
  }

  return groupRegion;
};

const fetchRespondentsByAgeGroup = async (params) => {
  const answersData = await findAnswer(params);

  let groupAgeGroup = {},
    total_respondent = await fetchRespondents(params, answersData);

  for (let el of answersData) {
    if (el.question && el.question.type === "respondent_age_group") {
      const { answers } = el;

      for (let age of el.question.options) {
        const key = age.option || age.value;

        if (!groupAgeGroup[key]) {
          groupAgeGroup[key] = {
            count: 0,
          };
        }

        for (let option of answers) {
          if (option._id === age._id) {
            groupAgeGroup[key].count += 1;
          }
        }
      }
    }
  }

  for (let key of Object.keys(groupAgeGroup)) {
    groupAgeGroup[key]["percentage"] = Math.round(
      (groupAgeGroup[key].count / total_respondent.total) * 100
    );
  }

  return groupAgeGroup;
};

const fetchByStatus = async (params) => {
  const answersData = await findAnswer(params);

  return { count: answersData.length };
};

const fetchAndGroupByUser = async (params) => {
  let { survey, organization, user, start_date, end_date } = params;

  let match = {};

  if (organization) {
    match.organization = mongoose.Types.ObjectId(organization);
  }

  if (survey) {
    match.survey = mongoose.Types.ObjectId(survey);
  }

  if (user) {
    match.user = mongoose.Types.ObjectId(user);
  }

  if (start_date && end_date) {
    match.createdAt = {
      $gte: new Date(start_date),
      $lt: new Date(end_date),
    };
  }

  const answersData = await answerMongo.aggregate([
    { $match: { ...match } },
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

const fetchCompletedIncomplete = async () => {
  // try {
  //   const answers = await findAnswer();
  //   const questions = await findQuestion();

  //   let groupBySurvey = {},
  //     groupByIdentifier = {};

  //   for (let el of questions) {
  //     if (!groupBySurvey[el.survey._id]) {
  //       groupBySurvey[el.survey._id] = { count: 0 };
  //     }
  //     groupBySurvey[el.survey._id]["count"] += 1;
  //   }

  //   for (let el of answers) {
  //     if (!groupBySurvey[el.survey._id]["data"]) {
  //       groupBySurvey[el.survey._id]["data"] = {};
  //     }
  //     if (!groupBySurvey[el.survey._id]["data"][el.identifier]) {
  //       groupBySurvey[el.survey._id]["data"][el.identifier] = [];
  //     }
  //     groupBySurvey[el.survey._id]["data"][el.identifier].push(el);
  //   }

  //   let completed = 0,
  //     incomplete = 0;

  //   for (let el of Object.keys(groupBySurvey)) {
  //     for (let identifier_item of Object.keys(groupBySurvey[el].data)) {
  //       if (identifier_item.length === groupBySurvey[el].count) {
  //         completed += 1;
  //       } else {
  //         incomplete += 1;
  //       }
  //     }

  //     if (!groupByIdentifier[el.identifier]) {
  //       groupByIdentifier[el.identifier] = [];
  //     }
  //     groupByIdentifier[el.identifier].push(el);
  //   }

  //   return {
  //     completed,
  //     incomplete,
  //   };
  // } catch (error) {
  //   console.log(error);
  // }
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
  fetchCompletedIncomplete,
  findAnswerNormal,
};
