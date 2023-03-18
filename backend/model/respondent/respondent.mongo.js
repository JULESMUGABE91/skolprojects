const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const respondentSchema = new Schema(
  {
    survey: {
      type: Schema.Types.ObjectId,
      ref: "Surveys",
      required: true,
    },
    organization: {
      type: Schema.Types.ObjectId,
      ref: "Organizations",
      required: true,
    },
    addedBy: {
      type: Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    name: {
      type: "String",
    },
    region: {
      type: "String",
    },
    phone_number: {
      type: "String",
    },
    email: {
      type: "String",
    },
    address: {
      type: "String",
    },
    gender: {
      type: "Object",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Respondents", respondentSchema);
