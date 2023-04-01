const Joi = require("@hapi/joi");

const validateAdminEmail = (data) => {
  const schema = Joi.object({
    email: Joi.string().required(),
    organization: Joi.string().required(),
  });

  return schema.validate(data);
};

module.exports = { validateAdminEmail };
