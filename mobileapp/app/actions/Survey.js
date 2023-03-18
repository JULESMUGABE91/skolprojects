export const ON_ANSWERING_SURVEY = 'ON_ANSWERING_SURVEY';

export const onAddAnsweringSurvey = payload => {
  return {
    type: ON_ANSWERING_SURVEY,
    payload,
  };
};
