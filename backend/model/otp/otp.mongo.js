const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const otpSchema = new Schema(
  {
    phone: {
      type: "String",
      required: true,
    },
    otp_code: {
      type: "String",
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("OTPCodes", otpSchema);
