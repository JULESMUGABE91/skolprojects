import uuid4 from "../utils/uuid4";

export const questionOptions = [
  {
    label: "Input",
    value: "textinput",
  },
  {
    label: "Respondent Name",
    value: "respondent_name",
  },
  {
    label: "Respondent Phone Number",
    value: "respondent_phone_number",
    type: "tel",
  },
  {
    label: "Respondent ID/Passport",
    value: "respondent_id_passport",
  },
  {
    label: "Respondent Address",
    value: "respondent_address",
  },

  {
    label: "Respondent Gender",
    value: "respondent_gender",
    defaultItems: [
      {
        _id: uuid4,
        type: "checkbox",
        option: "Male",
      },
      {
        _id: uuid4,
        type: "checkbox",
        option: "Female",
      },
    ],
  },

  {
    label: "Respondent Age",
    value: "respondent_age",
    type: "number",
  },
  {
    label: "Respondent Region",
    value: "respondent_region",
  },
  {
    label: "Respondent Age Group",
    value: "respondent_age_group",
  },
  {
    label: "Interviewer Name",
    value: "interviewer_name",
  },
  {
    label: "Interviewer ID",
    value: "interviewer_id",
  },
  {
    label: "Declaration",
    value: "declaration",
    defaultItems: [
      {
        _id: uuid4,
        type: "checkbox",
        option: "Yes",
      },
      {
        _id: uuid4,
        type: "checkbox",
        option: "No",
      },
    ],
  },
];

export const optionsOptions = [
  {
    label: "Checkbox",
    value: "checkbox",
  },
  {
    label: "TextInput",
    value: "input",
  },
  {
    label: "Number",
    value: "number",
  },
  {
    label: "Dropdown",
    value: "dropdown",
  },
];

export const respondents_info_fields = [
  "respondent_name",
  "respondent_gender",
  "respondent_age",
  "respondent_phone_number",
];
