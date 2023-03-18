const Joi = require("@hapi/joi");

const validateOrganization = (data) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    createdBy: Joi.string().required(),
  });

  return schema.validate(data);
};

module.exports = { validateOrganization };
