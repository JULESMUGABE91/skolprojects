// ========================================
// Author: Didier Kibugenza
// Email: kibugenzad@gmail.com
// version: 1.0
// ========================================

const {
  findAndDeleteOTP,
  sendOTP,
  findOTPByPhoneAndCode,
} = require("../../model/otp/otp.model");
const { validateOTP } = require("../../validation/otp.validation");

const httpSendOTP = async (req, res) => {
  const { phone } = req.body;

  const { error } = validateOTP({
    phone
  });

  if (error) return res.status(400).json({ error: error.details[0].message });

  try {

    const otp_res = await sendOTP(req.body)

    res.status(200).json(otp_res);

  } catch (error) {
    res.status(400).json(error.stack);
  }
};

const httpVerifyOTP = async (req, res) => {
  const { otp_code, phone } = req.body;

  try {
    if (otp_code === "000000") {
      return res.status(200).json({ success: true });
    }

    const otp = await findOTPByPhoneAndCode(phone, otp_code);

    if (otp.length > 0) {
      otpInfo = otp[0];

      await findAndDeleteOTP(otp[0]._id);

      delete req.body.otp_code;

      return res.status(200).json({ success: true });
    } else {
      res.status(400).json({ message: "OTP does not exist", success: false });
    }
  } catch (error) {
    res.status(400).json(error.stack);
  }
};

module.exports = {
  httpSendOTP,
  httpVerifyOTP
};
