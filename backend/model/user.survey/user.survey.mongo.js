const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const surveySchema = new Schema(
  {
    organization: {
      type: Schema.Types.ObjectId,
      ref: "Organizations",
      required: true,
    },
    survey: {
      type: Schema.Types.ObjectId,
      ref: "Surveys",
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    available: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserSurveys", surveySchema);
