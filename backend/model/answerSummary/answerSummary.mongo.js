const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schemaSchema = new Schema({
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
  question: {
    type: Schema.Types.ObjectId,
    ref: "Questions",
    required: true,
  },
  identifier: {
    type: "String",
    required: true,
  },
  answer: {
    type: "String",
    required: true,
  },
  count: {
    type: Number,
    required: true,
    default: 0,
  },
  questionType: {
    type: "String",
    required: true,
  },
  selection: {
    type: "Array",
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

module.exports = mongoose.model("AnswerSummary", schemaSchema);
