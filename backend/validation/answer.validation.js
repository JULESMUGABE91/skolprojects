const Joi = require("@hapi/joi");

const validateAnswer = (data) => {
  const schema = Joi.object({
    user: Joi.string().required(),
    question: Joi.string().required(),
    answers: Joi.array().required(),
    identifier: Joi.string().required(),
    survey: Joi.string().required(),
    organization: Joi.string().required(),
  });

  return schema.validate(data);
};

const validateBulkAnswer = (data) => {
  const schema = Joi.object({
    user: Joi.string().required(),
    questions: Joi.array().required(),
    identifier: Joi.string().required(),
    survey: Joi.string().required(),
    organization: Joi.string().required(),
  });

  return schema.validate(data);
};

module.exports = { validateAnswer, validateBulkAnswer };
