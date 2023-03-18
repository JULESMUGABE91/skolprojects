const GiftMongo = require("./gift.mongo");

const createGift = async (params) => {
  return await GiftMongo.create(params);
};

const findAndUpdateGift = async (_id, params) => {
  return await GiftMongo.findByIdAndUpdate({ _id }, params);
};

const findAndDeleteGift = async (_id) => {
  return await GiftMongo.findByIdAndDelete({ _id });
};

const findGift = async (params) => {
  const { id, organization } = params;
  let filters = {};

  if (id) {
    filters._id = id;
  }

  if (organization) {
    filters.organization = organization;
  }

  return await GiftMongo.find(filters).sort({ createdAt: -1 });
};

const findGiftById = async (_id) => {
  return await GiftMongo.findById({ _id });
};

module.exports = {
  createGift,
  findAndUpdateGift,
  findAndDeleteGift,
  findGift,
  findGiftById,
};
