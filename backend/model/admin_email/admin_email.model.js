const organizationMongo = require("../organization/organization.mongo");
const adminEmailMongo = require("./admin_email.mongo");

const createAdminEmail = async (params) => {
  return await adminEmailMongo.create(params);
};

const findAdminEmailAndUpdate = async (_id, params) => {
  return await adminEmailMongo.findByIdAndUpdate({ _id }, params);
};

const findAdminEmailAndDelete = async (_id) => {
  console.log({ _id });
  return await adminEmailMongo.findByIdAndDelete({ _id });
};

const findAdminEmailById = async (_id) => {
  return await adminEmailMongo
    .findById({ _id })
    .populate({ path: "organization", model: organizationMongo });
};

const findAdminEmail = async (params) => {
  const { email, organization } = params;

  let filters = {};

  if (email) {
    filters.email = email;
  }

  if (organization) {
    filters.organization = organization;
  }

  return await adminEmailMongo
    .find(filters)
    .populate({ path: "organization", model: organizationMongo });
};

module.exports = {
  findAdminEmail,
  createAdminEmail,
  findAdminEmailById,
  findAdminEmailAndUpdate,
  findAdminEmailAndDelete,
};
