const openQuestionAnswer = require("./openQuestionAnswer.mongo");
const { findAnswer } = require("../answer/answer.model");

const createOpenQuestion = async (params) => {
  try {
    const { answerType, answerOption, question, answerValue } = params;

    const exists = await fetchOpenQuestions({
      question,
      answer: answerOption,
    });

    if (
      answerValue &&
      answerValue !== "" &&
      (answerType !== "checkbox" || answerType === "dropdown")
    ) {
      if (exists.length == 0) {
        return await openQuestionAnswer.findByIdAndUpdate(
          { _id: exists[0]._id },
          {
            ...params,
          }
        );
      }

      await openQuestionAnswer.create({
        ...params,
        answer: answerValue,
        answerOption,
        otherType: "openQuestion",
      });
    }
  } catch (error) {
    console.log({ res: error });

    return error;
  }
};

const fetchOpenQuestions = async (params) => {
  return await openQuestionAnswer.find(params);
};

const fetchAnswerAndGenerateOpenQuestionAnswers = async (params) => {
  try {
    const answers = await findAnswer(params);

    for (let el of answers) {
      let identifier = el.identifier;

      for (let elAnswer of el.answers) {
        const population = await getPopulationGroup({
          question: el.question._id,
          answer: elAnswer.value || elAnswer.option,
          identifier,
        });

        await createOpenQuestion({
          question: el.question._id,
          organization: el.organization,
          survey: el.survey._id,
          answerType: elAnswer.type,
          answerValue: elAnswer.value,
          selection: elAnswer.selection,
          answerOption: elAnswer.option,
          questionType: el.question.type,
          createdAt: el.createdAt,
          updatedAt: el.updatedAt,
          ...population,
        });
      }
    }

    return "Data created " + answers.length;
  } catch (error) {
    console.log(error);
    return error.stack;
  }
};

const getPopulationGroup = async ({ question, answer, identifier }) => {
  const answers = await findAnswer({ identifier });
  let gender = {},
    ageGroup = {},
    region = {};

  if (answers.length > 0 && answer) {
    const data = await openQuestionAnswer.find({ question, answer });

    if (data.length !== 0) {
      gender = data[0].gender;
      ageGroup = data[0].ageGroup;
      region = data[0].region;
    }

    for (let el of answers) {
      if (el.question.type === "respondent_gender") {
        for (let elAns of el.answers) {
          if (!gender[elAns.option]) {
            gender[elAns.option] = 0;
          }
          gender[elAns.option] += 1;
        }
      }

      if (el.question.type === "respondent_age_group") {
        for (let elAns of el.answers) {
          if (!ageGroup[elAns.option]) {
            ageGroup[elAns.option] = 0;
          }
          ageGroup[elAns.option] += 1;
        }
      }

      if (el.question.type === "respondent_region") {
        for (let elAns of el.answers) {
          if (!region[elAns.option]) {
            region[elAns.option] = 0;
          }
          region[elAns.option] += 1;
        }
      }
    }
  }

  return {
    region,
    ageGroup,
    gender,
  };
};

module.exports = {
  createOpenQuestion,
  fetchAnswerAndGenerateOpenQuestionAnswers,
};
