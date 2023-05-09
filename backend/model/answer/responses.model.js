const answerMongo = require("./answer.mongo");
const responseMongo = require("./responses.mongo");

const createResponse = async (params) => {
  const { question, answer, count = 0 } = params;

  const checkExist = await responseMongo.find({ question, answer });

  if (checkExist.length === 0) {
    return await responseMongo.create(params);
  }

  let _count =
    count > 0 ? checkExist[0].count + count : checkExist[0].count + 1;

  await responseMongo.findByIdAndUpdate(
    { _id: checkExist[0]._id },
    { count: _count }
  );
};

module.exports = {
  createResponse,
};
