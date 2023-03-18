const Joi = require("@hapi/joi");

const validateProvider = (data) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    createdBy: Joi.string().required(),
    organization: Joi.string().required(),
  });

  return schema.validate(data);
};

module.exports = { validateProvider };
