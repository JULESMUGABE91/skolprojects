const rewardMongo = require("./reward.mongo");

const createReward = async (params) => {
  const checkReward = await findReward({
    user: params.user,
    organization: params.organization,
  });

  if (checkReward.length > 0) {
    let _id = checkReward[0]._id;

    await findAndUpdateReward(_id, params);

    return await findRewardById(_id);
  } else {
    return await rewardMongo.create(params);
  }
};

const findAndUpdateReward = async (_id, params) => {
  return await rewardMongo.findByIdAndUpdate({ _id }, params);
};

const findAndDeleteReward = async (_id) => {
  return await rewardMongo.findByIdAndDelete({ _id });
};

const findReward = async (params) => {
  const { id, user, organization } = params;
  let filters = {};

  if (id) {
    filters._id = id;
  }

  if (user) {
    filters.user = user;
  }

  if (organization) {
    filters.organization = organization;
  }

  return await rewardMongo.find(filters).sort({ createdAt: -1 });
};

const findRewardById = async (_id) => {
  return await rewardMongo.findById({ _id });
};

module.exports = {
  createReward,
  findAndDeleteReward,
  findAndUpdateReward,
  findReward,
  findRewardById,
};
