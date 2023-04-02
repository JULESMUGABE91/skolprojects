import moment from "moment";

export default (filters) => {
  let request_body = {};
  if (filters && filters?.organization) {
    request_body.organization = filters?.organization.value;
  }

  if (filters && filters?.survey) {
    request_body.survey = filters?.survey.value;
  }

  if (filters && filters?.question) {
    request_body.question = filters?.question.value;
  }

  if (filters && filters?.user) {
    request_body.user = filters?.user.value;
  }

  if (filters && filters?.start_date) {
    let start_date = filters?.start_date;

    request_body.start_date = start_date;
  }

  if (filters && filters?.end_date) {
    let end_date = filters?.end_date;

    request_body.end_date = moment(end_date).add("d", 1).format();
  }

  return request_body;
};
