const Joi = require("@hapi/joi");

const validatePhoneAuth = (data) => {
  const schema = Joi.object({
    phone: Joi.string().required(),
  });

  return schema.validate(data);
};

module.exports = { validatePhoneAuth };
