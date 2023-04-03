const { default: mongoose } = require("mongoose");
const { findAnswer } = require("../answer/answer.model");
const answerMongo = require("../answer/answer.mongo");
const { findUser } = require("../users/users.model");

const fetchSurveyorPerformance = async (params) => {
  const { account_type, organization, start_date, end_date } = params;

  let performance = {},
    resultArray = [],
    user_ids = [],
    answerFilters = {},
    commonFilters = {};

  if (organization) {
    commonFilters.organization = mongoose.Types.ObjectId(organization);
  }

  if (account_type) {
    commonFilters.account_type = account_type;
  }

  if (start_date && end_date) {
    answerFilters.createdAt = {
      $gte: new Date(start_date),
      $lt: new Date(end_date),
    };
  }

  const users = await findUser({ account_type, organization });

  for (let user of users) {
    user_ids.push(user._id);
  }

  const answers = await answerMongo.find({
    users: { $in: user_ids },
    ...commonFilters,
    ...answerFilters,
  });

  //get duplicates
  answers.map((item) => {
    if (
      resultArray.find((object) => {
        if (
          object.identifier === item.identifier &&
          object.question === item.question
        ) {
          //if the object exists iterate times
          object.times++;
          return true;
          //if it does not return false
        } else {
          return false;
        }
      })
    ) {
    } else {
      //if the object does not exists push it to the resulting array and set the times count to 1
      item.times = 1;
      resultArray.push(item);
    }
  });

  performance.incomplete = 0;
  performance.duplicate = 0;
  performance.completed = 0;

  for (let answer of answers) {
    if (answer.status === "incomplete") {
      performance.incomplete += 1;
    } else if (answer.times > 1) {
      performance.duplicate += 1;
    } else {
      performance.completed += 1;
    }
  }

  return performance;
};

module.exports = {
  fetchSurveyorPerformance,
};
