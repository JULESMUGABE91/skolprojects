const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const questionSchema = new Schema(
  {
    organization: {
      type: Schema.Types.ObjectId,
      ref: "Organizations",
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    survey: {
      type: Schema.Types.ObjectId,
      ref: "Surveys",
      required: true,
    },
    position: {
      type: "Number",
    },
    question: {
      type: "String",
      required: true,
    },
    options: {
      type: "Object",
    },
    setting: {
      type: "Object",
    },
    type: {
      type: "String",
    },
    point: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Questions", questionSchema);
