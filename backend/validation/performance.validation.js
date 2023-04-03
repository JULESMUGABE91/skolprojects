const Joi = require("@hapi/joi");

const validateSurveyorPerformance = (data) => {
  const schema = Joi.object({
    start_date: Joi.string().required(),
    end_date: Joi.string().required(),
    organization: Joi.string().required(),
  });

  return schema.validate(data);
};

module.exports = { validateSurveyorPerformance };
