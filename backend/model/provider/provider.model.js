const providerMongo = require("./provider.mongo");

const createProvider = async (params) => {
  const { organization, name } = params;

  try {
    const checkExist = await findProvider({
      organization,
      name,
    });

    if (checkExist.length > 0) {
      let id = checkExist[0]._id;

      await findProviderAndUpdate(id, params);

      const updated = await findProviderById(id);

      return updated;
    }

    return await providerMongo.create({ ...params });
  } catch (error) {
    return error;
  }
};

const findProviderAndUpdate = async (_id, params) => {
  return await providerMongo.findByIdAndUpdate({ _id }, params);
};

const findProviderAndDelete = async (_id) => {
  return await providerMongo.findByIdAndDelete({ _id });
};

const findProviderById = async (_id) => {
  return await providerMongo.findById({ _id });
};

const findProvider = async (params) => {
  const { id, organization, name } = params;
  let filters = {};

  if (id) {
    filters._id = id;
  }

  if (organization) {
    filters.organization = organization;
  }

  if (name) {
    filters.name = name;
  }

  return await providerMongo.find(filters).sort({ createdAt: -1 });
};

module.exports = {
  createProvider,
  findProvider,
  findProviderAndUpdate,
  findProviderAndDelete,
};
