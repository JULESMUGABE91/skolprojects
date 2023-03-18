const Joi = require("@hapi/joi");

const validateSurvey = (data) => {
  const schema = Joi.object({
    title: Joi.string().required(),
  });

  return schema.validate(data);
};

const validateUserAnsweredSurvey = (data) => {
  const schema = Joi.object({
    user: Joi.string().required(),
    organization: Joi.string().required(),
    survey: Joi.string().required(),
  });

  return schema.validate(data);
};

module.exports = { validateSurvey, validateUserAnsweredSurvey };
