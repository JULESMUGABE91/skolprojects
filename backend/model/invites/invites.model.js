const { isValidObjectId } = require("mongoose");
const invitesMongo = require("./invites.mongo");

const createInvite = async (params) => {
  const { organization, author, link, ref } = params;

  try {
    if (!isValidObjectId(author) || !isValidObjectId(organization)) {
      return {
        error: "Invalid link",
      };
    }

    const checkExist = await findInvite({
      organization,
      author,
      link,
    });

    if (checkExist.length > 0) {
      let id = checkExist[0]._id;
      let count = checkExist[0].count + 1;

      await findInviteAndUpdate(id, { count });

      const updated = await findInviteById(id);

      return updated;
    }

    return await invitesMongo.create({ ...params, count: 1 });
  } catch (error) {
    console.log(error);
  }
};

const findInviteAndUpdate = async (_id, params) => {
  return await invitesMongo.findByIdAndUpdate({ _id }, params);
};

const findInviteById = async (_id) => {
  return await invitesMongo.findById({ _id });
};

const findInvite = async (params) => {
  const { id, organization, link, author } = params;
  let filters = {};

  if (id) {
    filters._id = id;
  }

  if (organization) {
    filters.organization = organization;
  }

  if (author) {
    filters.author = author;
  }

  if (author) {
    filters.link = link;
  }

  return await invitesMongo.find(filters).sort({ createdAt: -1 });
};

module.exports = {
  createInvite,
  findInvite,
};
