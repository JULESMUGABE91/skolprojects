const responseMongo = require("./responses.mongo");

const createResponse = async (params) => {
  const { question, answer, count = 0 } = params;

  const checkExist = await responseMongo.find({ question, answer });

  if (checkExist.length === 0) {
    return await responseMongo.create(params);
  }

  let _count = count > 0 ? count : checkExist[0].count + 1;

  await responseMongo.findByIdAndUpdate(
    { _id: checkExist[0]._id },
    { count: _count }
  );
};

const fetchResponses = async (params) => {
  try {
    const answers = await responseMongo.aggregate([
      {
        $match: {},
      },
      {
        $group: {
          _id: "$question",
          answers: { $push: "$$ROOT" },
        },
      },
      {
        $project: {
          _id: 1,
          answers: 1,
        },
      },
    ]);

    return answers;
  } catch (error) {
    return error;
  }
};

module.exports = {
  createResponse,
  fetchResponses,
};
