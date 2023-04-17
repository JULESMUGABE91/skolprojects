import moment from "moment";

export default (filters) => {
  let name = filters.organization.label;

  if (filters.user.value) {
    name += " " + filters.user.label;
  }
  return name + " - " + moment().format("lll");
};
