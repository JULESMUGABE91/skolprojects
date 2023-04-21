const closeQuestionMongo = require("./closeQuestionAnswer.mongo");
const { findAnswer } = require("../answer/answer.model");
const { regions, gender: genderOptionPre } = require("../../constant/string");
const { createGender } = require("../gender/gender.modal");
const answerMongo = require("../answer/answer.mongo");
const { findAnswerNormal } = require("../answer/answer.model");
const questionMongo = require("../question/question.mongo");

const createCloseQuestion = async (params) => {
  try {
    const { answerType, answerOption, question, answerValue } = params;

    let count = 1,
      updatedSelection = [];

    const exists = await fetchCloseQuestions({
      question,
      answer: answerOption,
    });

    if (answerType === "checkbox") {
      if (exists.length !== 0) {
        count = exists[0].count + 1;

        return await closeQuestionMongo.findByIdAndUpdate(
          { _id: exists[0]._id },
          {
            ...params,
            count,
            selection: updatedSelection,
          }
        );
      } else {
        await closeQuestionMongo.create({
          ...params,
          answer: answerOption,
          count,
        });
      }

      return;
    }
  } catch (error) {
    console.log({ res: error });

    return error;
  }
};

const handleCloseQuestionMultipleSelection = ({
  answerType,
  selection,
  exist_selection,
  answerOption,
}) => {
  let updatedSelection = {};
  if (answerType === "dropdown") {
    let selectionItems = []; //selection:[{option:"test", count:1}]

    for (let elSelection of selection) {
      selectionItems.push(elSelection.value);
    }

    if (exist_selection.length > 0) {
      for (let elSelection of exist_selection || []) {
        if (selectionItems.includes(elSelection.value)) {
          if (!updatedSelection[elSelection.value]) {
            updatedSelection[elSelection.value] = 0;
          }
          updatedSelection[elSelection.value] += 1;
        }
      }
    } else {
      for (let elSelection of selection) {
        if (!updatedSelection[elSelection.value]) {
          updatedSelection[elSelection.value] = 0;
        }
        updatedSelection[elSelection.value] += 1;
      }
    }
  }

  console.log("====================================");
  console.log(updatedSelection);
  console.log("====================================");

  return updatedSelection;
};

const fetchCloseQuestions = async (params) => {
  return await closeQuestionMongo.find(params);
};

const fetchAnswerAndGenerateCloseQuestionAnswers = async (params) => {
  try {
    let group = {};
    const regionData = await answerMongo.aggregate([
      {
        $group: {
          _id: "$identifier",
          doc: { $first: "$$ROOT" },
        },
      },
      {
        $replaceRoot: {
          newRoot: "$doc",
        },
      },
      {
        $match: {
          gender: { $exists: true },
          region: { $exists: true },
          ageGroup: { $exists: true },
        }, // Filter out documents where either gender, region, or ageGroup is not defined
      },
      {
        $group: {
          _id: { region: "$region", gender: "$gender", ageGroup: "$ageGroup" },
          count: { $sum: 1 },
        },
      },
      {
        $sort: {
          "_id.region": 1,
          "_id.gender": 1,
          "_id.ageGroup": 1,
        },
      },
      {
        $group: {
          _id: { region: "$_id.region", gender: "$_id.gender" },
          ageGroupCounts: {
            $push: {
              ageGroup: "$_id.ageGroup",
              count: "$count",
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          region: "$_id.region",
          gender: "$_id.gender",
          ageGroupCounts: 1,
        },
      },
      {
        $sort: {
          region: 1,
          gender: 1,
        },
      },
    ]);

    return regionData;

    // let group = {};
    // const answers = await answerMongo
    //   .find({ identifier: "63ffdb94b551bc8aec516701__b1xcq1680258582054" })
    //   .populate({ path: "question", model: questionMongo })
    //   .limit(96);

    // const updateOps = [];

    // for (let el of answers) {
    //   if (!group[el.identifier]) {
    //     group[el.identifier] = [];
    //   }

    //   group[el.identifier].push({
    //     _id: el._id,
    //     answers: el.answers,
    //     question: el.question.type,
    //   });
    // }

    // for (let el of Object.keys(group)) {
    //   for (let item of group[el]) {
    //     if (item.question.replace(" ", "") === "respondent_gender") {
    //       const gender = item.answers[0].option.replace(" ", "");
    //       for (let i of group[el]) {
    //         if (i.question !== "respondent_gender") {
    //           i.gender = gender;
    //         }
    //       }
    //     }
    //   }

    //   const updateManyOps = group[el].map((item) => {
    //     return {
    //       updateOne: {
    //         filter: { _id: item._id },
    //         update: { $set: { gender: item.gender } },
    //       },
    //     };
    //   });

    //   updateOps.push(...updateManyOps);
    // }

    // await answerMongo.bulkWrite(updateOps);

    // for (let el of answers) {
    //   let identifier = el.identifier;

    // await createGender({ identifier });

    //   for (let elAnswer of el.answers) {
    //     const population = await getPopulationGroup({
    //       questionType: el.question.type,
    //       answer: elAnswer.value || elAnswer.option,
    //       identifier,
    //     });

    //     let keyAnswer = elAnswer.value || elAnswer.option;

    //     console.log("====================================");
    //     console.log(population);
    //     console.log("====================================");

    //     await createCloseQuestion({
    //       question: el.question._id,
    //       organization: el.organization,
    //       survey: el.survey._id,
    //       answerType: elAnswer.type,
    //       answerValue: elAnswer.value,
    //       selection: elAnswer.selection,
    //       answerOption: elAnswer.option,
    //       questionType: el.question.type,
    //       createdAt: el.createdAt,
    //       updatedAt: el.updatedAt,
    //       ...population,
    //     });
    //   }
    // }

    // return "Data created " + answers.length;
  } catch (error) {
    console.log(error.stack);
    return error.stack;
  }
};

const getPopulationGroup = async ({ questionType, answer, identifier }) => {
  const answers = await findAnswer({ identifier });
  let gender = {},
    ageGroup = {},
    region = {};

  if (answers.length > 0 && answer) {
    const data = await closeQuestionMongo.find({ questionType });

    if (data.length !== 0) {
      gender = data[0].gender;
      ageGroup = data[0].ageGroup;
      region = data[0].region;
    }

    for (let el of answers) {
      if (el.question.type === "respondent_gender") {
        for (let elAns of el.answers) {
          let key = getKey(genderOptionPre, elAns.option);
          if (!gender[key]) {
            gender[key] = 0;
          }

          gender[key] += 1;
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
          let key = getKey(regions, elAns.option);
          if (!region[key]) {
            region[key] = 0;
          }
          region[key] += 1;
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

const getKey = (data, option) => {
  let key = "";
  for (let el of data) {
    if (
      option.replace(" ", "").replace(" ", "").toLowerCase() ===
      el.label.replace(" ", "").replace(" ", "").toLowerCase()
    ) {
      key = el.value;
    }
  }

  if (key === "") {
    console.log({ data, option });
  }

  return key;
};

module.exports = {
  createCloseQuestion,
  fetchAnswerAndGenerateCloseQuestionAnswers,
};
