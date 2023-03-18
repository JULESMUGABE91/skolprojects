export const getAnsweredQuestions = (questions, answers) => {
  let question_ids = [],
    answered_questions = [];

  for (let question of questions) {
    if (!question_ids.includes(question._id)) {
      question_ids.push(question._id);
    }
  }

  for (let answer of answers) {
    if (question_ids.includes(answer.question)) {
      answered_questions.push(answer.question);
    }
  }

  return answered_questions;
};

const checkLocalSurveyAnswered = (survey_id, local_surveys) => {
  let isAnswered = false;

  for (let survey of local_surveys) {
    if (survey._id === survey_id) {
      isAnswered = true;

      const percentage = calculatePercentage(survey);
    }
  }

  return {
    isAnswered,
  };
};

const calculatePercentage = survey => {
  let percentage = 0;

  const {questions} = [];

  return percentage;
};
