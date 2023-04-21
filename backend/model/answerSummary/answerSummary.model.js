const answerMongo = require("../answer/answer.mongo");
const summaryMongo = require("../answerSummary/answerSummary.mongo");

const createAnswerSummary = async (params) => {
  try {
    const {
      answerType,
      answerValue,
      answerOption,
      selection = [],
      question,
    } = params;

    let count = 1,
      updatedSelection = [];

    if (answerType === "checkbox") {
      const exists = await fetchAnswerSummary({
        question,
        answer: answerOption,
      });

      if (exists.length !== 0) {
        count = exists[0].count + 1;

        // if (answerType === "dropdown") {
        //   let selectionItems = []; //selection:[{option:"test", count:1}]

        //   for (let elSelection of selection) {
        //     selectionItems.push(elSelection.value);
        //   }

        //   console.log(selectionItems);

        //   for (let elSelection of exists.selection || selection) {
        //     if (selectionItems.includes(elSelection.value)) {
        //       if (elSelection.count === undefined) {
        //         elSelection.count = 0;
        //       }
        //       elSelection.count += 1;

        //       updatedSelection.push(elSelection);
        //     }
        //   }
        // }

        console.log({ exist: true });

        return await summaryMongo.findByIdAndUpdate(
          { _id: exists[0]._id },
          {
            ...params,
            count,
            selection: updatedSelection,
          }
        );
      } else {
        await summaryMongo.create({
          ...params,
          answer: answerOption,
          count,
        });
      }
    } else {
      // return await summaryMongo.create({ ...params, answer: answerValue });
    }
  } catch (error) {
    console.log({ res: error });
  }
};

const fetchAnswerSummary = async (params) => {
  return await summaryMongo.find(params);
};

const fetchRespondent = async (params) => {
  return await summaryMongo.find(params).count();
};

const fetchRespondentGender = async (params) => {
  // const answerSummary = await fetchAnswerSummary(params);
  // console.log(answerSummary);
  // const results = answerSummary.map(async (el) => {
  //   let groupData = {};
  //   const answersData = await findAnswerByField({ identifier: el.identifier });

  //   for (let answer of answersData) {
  //     if (answer.question.type === "respondent_gender") {
  //       let answerItem = answer.answers.option;

  //       if (!groupData[answerItem]) {
  //         groupData[answerItem] = 0;
  //       }
  //       groupData[answerItem] += 1;
  //     }
  //   }

  //   return groupData;
  // });

  // male: 30, 25-30: 50, ...

  const answers = await answerMongo.aggregate([
    // { $match: { ...params } },
    {
      $group: {
        _id: { identifier: "$identifier", user: "$user" },
        doc: { $first: "$$ROOT" },
      },
    },
    { $replaceRoot: { newRoot: "$doc" } },
    { $limit: 10 },
  ]);

  const group = ["respondent_gender"];

  for (let answer of answers) {
    let groupKey = "",
      identifier = "",
      questionnaires = [];
    if (group.includes(answer.question.type)) {
      groupKey = answer.answers[0].option;

      identifier = answer.identifier;

      if (!groupData[groupKey]) {
        groupData[groupKey] = {
          count: 0,
        };
      }
      groupData[groupKey] += 1;
    }

    if (identifier === answer.identifier) {
      for (let elAnswer of answer.answers) {
        if (!groupData[groupKey][elAnswer.option]) {
          groupData[groupKey][elAnswer.option] = 0;
        }

        groupData[groupKey][elAnswer.option] += 1;
      }
    }
  }

  console.log("====================================");
  console.log(groupData);
  console.log("====================================");

  // return results;
};

module.exports = {
  createAnswerSummary,
  fetchRespondentGender,
};
