const answerMongo = require("./answer.mongo");
const responseMongo = require("./responses.mongo");

const createResponse = async (params) => {
  const { question, answer } = params;

  console.log("====================================");
  console.log(params);
  console.log("====================================");

  const checkExist = await responseMongo.find({ question, answer });

  if (checkExist.length === 0) {
    return await responseMongo.create(params);
  }

  let count = checkExist[0].count + 1;

  await responseMongo.findByIdAndUpdate({ _id: checkExist[0]._id }, { count });
};

module.exports = {
  createResponse,
};
