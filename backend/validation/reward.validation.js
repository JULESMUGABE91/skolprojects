const Joi = require("@hapi/joi");

const validateReward = (data) => {
  const schema = Joi.object({
    user: Joi.string().required(),
  });

  return schema.validate(data);
};

module.exports = { validateReward };
