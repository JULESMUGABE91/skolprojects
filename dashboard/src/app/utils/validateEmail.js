export default (email) => {
  return email.includes("@") && email.includes(".");
};
