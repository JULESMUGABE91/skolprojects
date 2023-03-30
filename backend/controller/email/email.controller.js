// ========================================
// Author: Didier Kibugenza
// Email: kibugenzad@gmail.com
// version: 1.0
// ========================================

const { sendEmail } = require("../../services/email");

const httpEmail = async (req, res) => {
  try {
    const emailInfo = await sendEmail(req.body);

    res.status(200).json(emailInfo);
  } catch (error) {
    res.status(400).json(error.stack);
  }
};

module.exports = {
  httpEmail,
};
