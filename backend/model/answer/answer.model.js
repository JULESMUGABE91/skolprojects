const { isValidObjectId } = require("mongoose");
const { gender, regions } = require("../../constant/string");
const questionMongo = require("../question/question.mongo");
const { createReward, findReward } = require("../reward/reward.model");
const surveyMongo = require("../survey/survey.mongo");
const userMongo = require("../users/user.mongo");
const answerMongo = require("./answer.mongo");

const createAnswer = async (params) => {
  delete params._id;

  const answerInfo = await answerMongo.create(params);

  const savedAnswer = await findAnswerById(answerInfo._id);

  markQuestion(savedAnswer.organization, savedAnswer.question, params.user);

  return savedAnswer;
};

const createBulkAnswer = async (params) => {
  const { questions, organization, survey, identifier, user } = params;

  delete params._id;

  let answers = [];

  for (let el of questions) {
    const answerInfo = await answerMongo.create({
      ...el,
      ...organization,
      survey,
      identifier,
      user,
    });

    const savedAnswer = await findAnswerById(answerInfo._id);

    // markQuestion(savedAnswer.organization, savedAnswer.question, params.user);

    answers.push(savedAnswer);
  }

  return answers;
};

const findAndUpdateAnswer = async (_id, params) => {
  return await answerMongo.findByIdAndUpdate({ _id }, params);
};

const findAndDeleteAnswer = async (_id) => {
  return await answerMongo.findByIdAndDelete({ _id });
};

const findAnswer = async (params) => {
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
  } = params;
  let filters = {};

  if (id) {
    filters._id = id;
  }

  if (question) {
    filters.question = question;
  }

  if (survey) {
    filters.survey = survey;
  }

  if (user) {
    filters.user = user;
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
    filters.organization = organization;
  }

  if (status) {
    filters.status = status;
  }

  return await answerMongo
    .find(filters)
    .populate({ path: "question", model: questionMongo })
    .populate({
      path: "user",
      model: userMongo,
      select: { firstname: 1, lastname: 1 },
    })
    .sort(sort);
};

const findMySurvey = async (params) => {
  const { user } = params;

  let surveys = [],
    filters = {},
    survey_ids = [];

  if (user) {
    filters.user = user;
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
  let { organization, survey } = params;

  const answers = await findAnswer({
    organization,
    survey,
    sort: "asc",
  });

  const group_answers_question = await groupAnswersByQuestion(answers);

  return group_answers_question;
};

const groupAnswersByQuestion = async (answers) => {
  let group_per_question = {};

  for (let el of answers) {
    if (el.question) {
      const q_key = el.question.question;

      if (!group_per_question[q_key]) {
        group_per_question[q_key] = [];
      }

      group_per_question[q_key].push(el);
    }
  }
  const results = await groupByAnswer(group_per_question);

  return results;
};

const groupByAnswer = async (group_per_question) => {
  let results = {};

  for (let question of Object.keys(group_per_question)) {
    if (Object.values(group_per_question).length > 0) {
      for (let answer of group_per_question[question]) {
        let { answers, survey, user } = answer;

        if (!results[question]) {
          results[question] = {};
        }

        for (let item of answers) {
          if (
            item.type === "checkbox"
            // || item.type === "textinput"
          ) {
            //close question
            //each group response
            let key =
              item.type === "textinput"
                ? item.option + "_" + item.value
                : item.option;

            if (!results[question][key]) {
              results[question][key] = {
                count: 0,
              };
            }

            results[question][key]["count"] += 1;

            if (!results[question][key]["respondent"]) {
              results[question][key]["respondent"] = [];
            }

            if (
              !results[question][key]["respondent"].includes(user.toString())
            ) {
              results[question][key]["respondent"].push(user.toString());
            }
          }
          // else if (item.type === "dropdown") {
          //   if (!results[question][item.option]) {
          //     results[question][item.option] = {
          //       type: "dropdown",
          //     };
          //   }

          //   for (let el of item?.selection || []) {
          //     if (!results[question][item.option][el._id]) {
          //       results[question][item.option][el._id] = {
          //         count: 0,
          //         option: el.value,
          //       };
          //     }

          //     results[question][item.option][el._id]["count"] += 1;
          //   }
          // }
        }
      }
    }
  }

  return results;
};

const fetchRespondents = async (params) => {
  let data = [],
    { survey, organization } = params;

  const answers = await findAnswer({ survey, organization });

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
  let { survey, organization } = params;

  const answersData = await findAnswer({ survey, organization });

  let groupGender = {},
    total_respondent = await fetchRespondents(params);

  for (let el of answersData) {
    if (el.question && el.question.type === "respondent_gender") {
      const { answers } = el;

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

  return groupGender;
};

const fetchRespondentsByRegion = async (params) => {
  let { survey, organization } = params;

  const answersData = await findAnswer({ survey, organization });

  let groupRegion = {},
    total_respondent = await fetchRespondents(params);

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
            if (option._id === region._id) {
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
  let { survey, organization } = params;

  const answersData = await findAnswer({ survey, organization });

  let groupAgeGroup = {},
    total_respondent = await fetchRespondents(params);

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
  let { survey, organization, status } = params;

  const answersData = await findAnswer({ survey, organization, status });

  return { count: answersData.length };
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
};
