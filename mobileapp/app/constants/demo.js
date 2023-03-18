import uuid4 from '../utils/uuid4';

const survey_id = uuid4;

export const surveys = [
  {
    _id: survey_id,
    title: 'Test Survey',
  },
];

export const questions = [
  {
    survey: {
      _id: survey_id,
      title: 'Test Survey',
    },
    question: 'Test Survey',
    answer: {
      data: [
        {
          label: 'yes',
          type: 'checkbox',
        },
        {
          label: 'No',
          type: 'checkbox',
        },
      ],
      settings: {
        isMultiple: false,
      },
    },
  },
];

export default answers = [
  {
    user: 'abc122334',
    question: {
      _id: 'Q19329323',
      question: 'Test Survey',
    },
  },
];
