const Joi = require("@hapi/joi");

const validateGift = (data) => {
  const schema = Joi.object({
    max_point: Joi.number().required(),
    min_point: Joi.number().required(),
    file: Joi.string().required(),
    addedBy: Joi.string().required(),
    name: Joi.string().required(),
    organization: Joi.string().required(),
  });

  return schema.validate(data);
};

module.exports = { validateGift };
