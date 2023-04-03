const organizationMongo = require("../organization/organization.mongo");
const userMongo = require("./user.mongo");

const findUserByPhone = async (phone) => {
  return await userMongo.find({ phone });
};

const createUser = async (params) => {
  return await userMongo.create(params);
};

const findUserAndUpdate = async (_id, params) => {
  return await userMongo.findByIdAndUpdate({ _id }, params);
};

const findUseById = async (_id) => {
  return await userMongo
    .findById({ _id })
    .populate({ path: "organization", model: organizationMongo });
};

const findUser = async (params) => {
  const { id, badge, phone, organization, account_type } = params;

  let filters = {};

  if (id) {
    filters._id = id;
  }

  if (badge) {
    filters.badge = badge;
  }

  if (organization) {
    filters.organization = organization;
  }

  if (phone) {
    filters.phone = phone;
  }

  if (account_type) {
    filters.account_type = account_type;
  }

  return await userMongo
    .find(filters)
    .populate({ path: "organization", model: organizationMongo });
};

module.exports = {
  findUserByPhone,
  createUser,
  findUserAndUpdate,
  findUseById,
  findUser,
};
