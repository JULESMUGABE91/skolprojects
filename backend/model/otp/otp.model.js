const OTPgenerate = require("../../utils/otp/OTPgenerate");
const otpMongo = require("./otp.mongo");
const { sendSms } = require("../../services/sms");

const sendOTP = async (params) => {
  const { phone } = params;

  const new_otp = await OTPgenerate(6);

  params.otp_code = new_otp;

  const sms_res = await sendSms(phone, "Skol Experience OTP Code " + new_otp);

  console.log({ new_otp, sms_res });

  let response = {}

  if (sms_res?.success) {
    await otpMongo.create({
      phone,
      otp_code: new_otp
    });

    response = {
      success: true,
      status: "sent"
    }
  } else {

    response = {
      success: true,
      status: "notsent",
      top: new_otp,
      providerMessage: sms_res.providerMessage
    }
  }

  return response
};

const findOTPById = async (_id) => {
  return await otpMongo.findById({ _id });
};

const findOTPByUserId = async (user) => {
  return await otpMongo.find({ user });
};

const findAndUpdateOTP = async (_id, params) => {
  return await otpMongo.findByIdAndUpdate({ _id }, params);
};

const findAndDeleteOTP = async (_id) => {
  return await otpMongo.findByIdAndDelete({ _id });
};

const findOTPByPhoneAndCode = async (phone, otp_code) => {
  return await otpMongo.find({ phone, otp_code });
};

module.exports = {
  findOTPById,
  sendOTP,
  findOTPById,
  findOTPByUserId,
  findAndDeleteOTP,
  findAndUpdateOTP,
  findOTPByPhoneAndCode,
};
