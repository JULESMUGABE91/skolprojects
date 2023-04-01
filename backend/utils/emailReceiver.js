const { findAdminEmail } = require("../model/admin_email/admin_email.model");

const getEmailReceivers = async (params = {}) => {
  console.log("====================================");
  console.log(params);
  console.log("====================================");
  let receivers = [];
  const admin_emails = await findAdminEmail(params);
  for (let el of admin_emails) {
    receivers.push(el.email);
  }

  return receivers;
};

module.exports = {
  getEmailReceivers,
};
