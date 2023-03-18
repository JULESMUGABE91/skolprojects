const Joi = require("@hapi/joi");

const validateOTP = (data) => {
  const schema = Joi.object({
    phone: Joi.string().required()
  });

  return schema.validate(data);
};


module.exports = { validateOTP };
