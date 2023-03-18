const Joi = require("@hapi/joi");

const validateQuestion = (data) => {
  const schema = Joi.object({
    survey: Joi.string().required(),
    question: Joi.string().required(),
    user: Joi.string().required(),
  });

  return schema.validate(data);
};

module.exports = { validateQuestion };
