const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    organization: {
      type: Schema.Types.ObjectId,
      ref: "Organizations",
    },
    phone: {
      required: true,
      type: "String",
      unique: true,
    },
    firstname: {
      type: "String",
    },
    lastname: {
      type: "String",
    },
    email: {
      type: "String",
    },
    account_type: {
      type: "String",
      default: "normal",
    },
    fb_token: {
      type: "String",
    },
    file: {
      type: "String",
    },
    isPhoneVerified: {
      type: "Boolean",
      default: false,
    },
    isEmailVerified: {
      type: "Boolean",
      default: false,
    },
    age: {
      type: "Number",
    },
    gender: {
      type: "String",
    },
    location: {
      type: "Object",
    },
    id_number: {
      type: "String",
    },
    badge: {
      type: "String",
      default: "explorer",
    },
    country: {
      type: "String",
      default: "Rwanda",
    },
    province: {
      type: "String",
    },
    district: {
      type: "String",
    },
    cell: {
      type: "String",
    },
    sector: {
      type: "String",
    },
    village: {
      type: "String",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Users", userSchema);
