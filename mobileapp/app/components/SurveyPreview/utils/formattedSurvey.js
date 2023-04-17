export default ({survey, start_interview, my_location, questions}) => {
  let formatted = [];

  for (let question of questions) {
    if (question.responses && Object.keys(question?.error || {}).length === 0) {
      formatted.push({
        survey: survey._id,
        question: question._id,
        answers: question.responses,
        start_location: {
          coordinates: [my_location.latitude, my_location.longitude],
          address: my_location.name,
        },
        end_location: {
          coordinates: [my_location.latitude, my_location.longitude],
          address: my_location.name,
        },
        start_interview,
        end_interview: new Date().getTime(),
      });
    }
  }

  return formatted;
};
