const answerMongo = require("./answer.mongo");
const questionMongo = require("../question/question.mongo");

module.exports = async () => {
  const answers = await answerMongo.aggregate([
    {
      $match: {
        gender: {
          $exists: false,
        },
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
      $project: {
        _id: 1,
        identifier: 1,
        "question.type": 1,
        answers: 1,
      },
    },
  ]);

  let groupData = {};

  for (let el of answers) {
    if (!groupData[el.identifier]) {
      groupData[el.identifier] = [];
    }

    groupData[el.identifier].push({
      _id: el._id,
      question: el.question,
      answers: el.answers,
    });
  }

  const bulkOperations = [];

  for (let el of Object.keys(groupData)) {
    for (let groupItem of groupData[el]) {
      if (groupItem.question.type === "respondent_gender") {
        const key = groupItem.answers[0].option;

        bulkOperations.push({
          updateMany: {
            filter: { identifier: el },
            update: { $set: { gender: key } },
          },
        });
      }

      if (groupItem.question.type === "respondent_age_group") {
        const key = groupItem.answers[0].option;

        bulkOperations.push({
          updateMany: {
            filter: { identifier: el },
            update: { $set: { ageGroup: key } },
          },
        });
      }

      if (groupItem.question.type === "respondent_region") {
        const key = groupItem.answers[0].option;

        bulkOperations.push({
          updateMany: {
            filter: { identifier: el },
            update: { $set: { region: key } },
          },
        });
      }
    }
  }

  if (bulkOperations.length > 0) {
    await answerMongo.bulkWrite(bulkOperations);
  }

  return bulkOperations.length

};
