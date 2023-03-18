const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const surveySchema = new Schema(
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
    total_reward: {
      type: "Number",
      required: true,
      default: 0,
    },
    total_withdraw: {
      type: "Number",
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Rewards", surveySchema);
