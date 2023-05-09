const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const surveySchema = new Schema(
  {
    question: {
      type: Schema.Types.ObjectId,
      ref: "Questions",
    },
    question: {
      type: "String",
      required: true,
    },
    answer: {
      type: "String",
      // required: true,
    },
    answerOption: {
      type: "String",
      required: true,
    },
    count: {
      type: Number,
      required: true,
      default: 1,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Responses", surveySchema);
