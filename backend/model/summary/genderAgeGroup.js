const { regions, gender } = require("../../constant/string");
const { getKey } = require("../../utils/preDataKey");
const answerMongo = require("../answer/answer.mongo");

const fetchGenderAgeGroup = async (params = {}) => {
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
          ...params,
          $or: [
            { "question.type": "respondent_gender" },
            { "question.type": "respondent_age_group" },
          ],
        },
      },
      {
        $group: {
          _id: { gender: "$gender", ageGroup: "$ageGroup" },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          gender: "$_id.gender",
          ageGroup: "$_id.ageGroup",
          count: 1,
        },
      },
    ]);

    return answers;
  } catch (error) {
    return error.stack;
  }
};

module.exports = {
  fetchGenderAgeGroup,
};
