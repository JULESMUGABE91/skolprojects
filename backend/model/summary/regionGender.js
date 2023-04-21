const { regions, gender } = require("../../constant/string");
const { getKey } = require("../../utils/preDataKey");
const answerMongo = require("../answer/answer.mongo");

const fetchRegionPerGender = async () => {
  try {
    const answers = await answerMongo.aggregate([
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
        $match: { gender: { $exists: true }, region: { $exists: true } }, // Filter out documents where either gender or region is not defined
      },
      {
        $group: {
          _id: { region: "$region", gender: "$gender" },
          count: { $sum: 1 },
        },
      },
      {
        $sort: {
          "_id.region": 1,
          "_id.gender": 1,
        },
      },
      {
        $group: {
          _id: "$_id.region",
          genderCounts: {
            $push: {
              gender: "$_id.gender",
              count: "$count",
            },
          },
        },
      },
    ]);

    let groupData = {};

    for (let el of answers) {
      let regionKey = getKey(regions, el._id);

      if (!groupData[regionKey]) {
        groupData[regionKey] = [];
      }

      groupData[regionKey].push(el.genderCounts);
    }

    return handleFinalDataSet(groupData);
  } catch (error) {
    return error;
  }
};

const handleFinalDataSet = (data) => {
  let results = {};
  for (let el of Object.keys(data)) {
    let c_gender = combineGender(data[el]);

    let genderObj = {};
    for (let elG of c_gender) {
      let genderKey = getKey(gender, elG.gender);

      if (!genderObj[genderKey]) {
        genderObj[genderKey] = 0;
      }
      genderObj[genderKey] += elG.count;
    }

    results[el] = genderObj;
  }

  return results;
};

const combineGender = (data) => {
  return data.flat();
};

module.exports = {
  fetchRegionPerGender,
};
