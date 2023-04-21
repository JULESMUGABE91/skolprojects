const answerMongo = require("./answer.mongo");
const questionMongo = require("../question/question.mongo");

module.exports = async () => {
  const answers = await answerMongo.find().populate({
    path: "question",
    model: questionMongo,
    select: { type: 1 },
  });

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

  for (let el of Object.keys(groupData)) {
    for (let groupItem of groupData[el]) {
      if (groupItem.question.type === "respondent_gender") {
        const key = groupItem.answers[0].option;

        const fetchByIdentifier = await answerMongo.find({ identifier: el });

        for (let groupAnswer of fetchByIdentifier) {
          await answerMongo.findByIdAndUpdate(
            { _id: groupAnswer._id },
            { gender: key }
          );
        }
      }

      if (groupItem.question.type === "respondent_age_group") {
        const key = groupItem.answers[0].option;

        const fetchByIdentifier = await answerMongo.find({ identifier: el });

        for (let groupAnswer of fetchByIdentifier) {
          const a = await answerMongo.findByIdAndUpdate(
            { _id: groupAnswer._id },
            { ageGroup: key }
          );
        }
      }

      if (groupItem.question.type === "respondent_region") {
        const key = groupItem.answers[0].option;

        const fetchByIdentifier = await answerMongo.find({ identifier: el });

        for (let groupAnswer of fetchByIdentifier) {
          await answerMongo.findByIdAndUpdate(
            { _id: groupAnswer._id },
            { region: key }
          );
        }
      }
    }
  }
};
