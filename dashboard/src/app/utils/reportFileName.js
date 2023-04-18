import moment from "moment";

export default (filters) => {
  let name = filters.organization
    ? filters.organization.label
    : new Date().getTime();

  if (filters.user && filters.user.value) {
    name += " " + filters.user.label;
  }
  return name + " - " + moment().format("lll");
};
