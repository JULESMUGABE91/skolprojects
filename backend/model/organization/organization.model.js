const OrganizationMongo = require("./organization.mongo");

const createOrganization = async (params) => {
  const { name } = params;

  const checkExist = await findOrganization({
    name: name,
  });

  if (checkExist.length > 0)
    return {
      error: "Name already exist",
    };

  return await OrganizationMongo.create(params);
};

const findAndUpdateOrganization = async (_id, params) => {
  return await OrganizationMongo.findByIdAndUpdate({ _id }, params);
};

const findAndDeleteOrganization = async (_id) => {
  return await OrganizationMongo.findByIdAndDelete({ _id });
};

const findOrganization = async (params) => {
  const { id, createdBy, name } = params;
  let filters = {};

  if (id) {
    filters._id = id;
  }

  if (createdBy) {
    filters.createdBy = createdBy;
  }

  if (name) {
    filters.name = name;
  }

  return await OrganizationMongo.find(filters).sort({ createdAt: -1 });
};

const findOrganizationById = async (_id) => {
  return await OrganizationMongo.findById({ _id });
};

module.exports = {
  createOrganization,
  findAndDeleteOrganization,
  findAndUpdateOrganization,
  findOrganization,
  findOrganizationById,
};
