import moment from "moment";

export default (filters) => {
  let request_body = {};
  if (filters && filters?.organization) {
    request_body.organization = filters?.organization.value;
  }

  if (filters && filters?.survey && filters?.survey.value) {
    request_body.survey = filters?.survey.value;
  }

  if (filters && filters?.question) {
    request_body.question = filters?.question.value;
  }

  if (filters && filters?.user) {
    request_body.user = filters?.user?.value;
  }

  if (filters && filters?.account_type) {
    request_body.account_type = filters?.account_type;
  }

  if (filters && filters?.search) {
    request_body.search = filters?.search;
  }

  if (filters && filters?.page) {
    request_body.page = filters?.page;
  }

  if (filters && filters?.limit) {
    request_body.limit = filters?.limit;
  }

  if (filters && filters?.start_date) {
    let start_date = filters?.start_date;

    request_body.start_date = start_date;
  }

  if (filters && filters?.end_date) {
    let end_date = filters?.end_date;

    if (end_date === filters?.end_date) {
      request_body.end_date = moment(end_date).endOf("day").format();
    }
  }

  return request_body;
};
