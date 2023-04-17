export default ({current_question_index, questions}) => {
  let copyQuestions = questions.slice(0);

  if (
    !questions[current_question_index] ||
    (questions[current_question_index] &&
      (!questions[current_question_index]?.responses ||
        questions[current_question_index]?.responses?.length === 0))
  ) {
    copyQuestions.splice(current_question_index, 1);

    current_question_index =
      current_question_index > 0 ? current_question_index - 1 : 0;
  }

  return copyQuestions;
};
