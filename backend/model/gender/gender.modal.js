const { findAnswer } = require("../answer/answer.model");
const genderMongo = require("./gender.mongo");
const { regions, gender: genderOptionPre } = require("../../constant/string");

const createGender = async (params) => {
  try {
    const { identifier } = params;

    const { count, gender, ageGroup, region } = await getCounts(identifier);

    console.log({
      count,
      ageGroup,
      gender,
      region,
    });

    if (count === 0) {
      return;
    }

    const exists = await fetchGender({ gender });

    if (exists.length > 0) {
      return await genderMongo.findByIdAndUpdate(
        { _id: exists[0]._id },
        { count, gender, ageGroup, region }
      );
    }

    return await genderMongo.create({ count, gender, ageGroup, region });
  } catch (error) {
    console.log(error);
  }
};

const fetchGender = async (params = {}) => {
  const gender = await genderMongo.find(params);

  return gender;
};

let ageGroup = {},
  region = {},
  genderAnswer = {},
  ageGroupAnswer = {},
  regionAnswer = {},
  count = 0;

const getCounts = async (identifier) => {
  let gender = "";

  const answers = await findAnswer({ identifier });

  console.log({ answers: answers.length });

  for (let answer of answers) {
    if (answer.question.type === "respondent_gender") {
      genderAnswer = { ...answer };
    }

    if (answer.question.type === "respondent_region") {
      regionAnswer = { ...answer };
    }

    if (answer.question.type === "respondent_age_group") {
      ageGroupAnswer = { ...answer };
    }
  }

  if (genderAnswer.answers && genderAnswer.answers.length > 0) {
    let exists = [];
    for (let elAns of genderAnswer.answers) {
      gender = getKey(genderOptionPre, elAns.option);

      exists = await fetchGender({ gender });

      if (exists.length > 0) {
        count = exists[0].count + 1;
        ageGroup = exists[0].ageGroup;
        region = exists[0].region;
      } else {
        count = 1;
      }
    }
  }

  if (regionAnswer.answers && regionAnswer.answers.length) {
    for (let elAns of regionAnswer.answers) {
      let key = getKey(regions, elAns.option);

      if (!region[key]) {
        region[key] = 0;
      }
      region[key] += 1;
    }
  }

  if (ageGroupAnswer.answers && ageGroupAnswer.answers.length) {
    for (let elAns of ageGroupAnswer.answers) {
      if (!ageGroup[elAns.option]) {
        ageGroup[elAns.option] = 0;
      }
      ageGroup[elAns.option] += 1;
    }
  }

  return {
    count,
    ageGroup,
    gender,
    region,
  };
};

const getKey = (data, option) => {
  let key = "";
  for (let el of data) {
    if (
      option.replace(" ", "").replace(" ", "").toLowerCase() ===
      el.label.replace(" ", "").replace(" ", "").toLowerCase()
    ) {
      key = el.value;
    }
  }

  if (key === "") {
    console.log({ data, option });
  }

  return key;
};

module.exports = {
  fetchGender,
  createGender,
};
