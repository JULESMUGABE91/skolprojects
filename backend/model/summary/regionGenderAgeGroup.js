const { regions, gender } = require("../../constant/string");
const { getKey } = require("../../utils/preDataKey");
const answerMongo = require("../answer/answer.mongo");

const fetchRegionGenderAgeGroup = async (params = {}) => {
  console.log(params);
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

    let groupData = {};

    for (let el of answers) {
      let regionKey = getKey(regions, el.region);

      if (!groupData[regionKey]) {
        groupData[regionKey] = [];
      }

      groupData[regionKey].push({
        gender: el.gender,
        ageGroupCounts: el.ageGroupCounts,
      });
    }

    return handleFinalDataSet(groupData);
  } catch (error) {
    return error.stack;
  }
};

const handleFinalDataSet = (data) => {
  let genderObj = {};
  for (let el of Object.keys(data)) {
    for (let elG of data[el]) {
      let genderKey = getKey(gender, elG.gender);

      if (!genderObj[el]) {
        genderObj[el] = {};
      }

      if (!genderObj[el][genderKey]) {
        genderObj[el][genderKey] = {};
      }
      genderObj[el][genderKey] = elG.ageGroupCounts;
    }
  }

  return genderObj;
};

module.exports = {
  fetchRegionGenderAgeGroup,
};
