const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const giftSchema = new Schema(
  {
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
    provider: {
      type: Schema.Types.ObjectId,
      ref: "Providers",
      required: true,
    },
    min_point: {
      type: "Number",
      required: true,
    },
    max_point: {
      type: "Number",
      required: true,
    },
    name: {
      type: "String",
      required: true,
    },
    file: {
      type: "String",
      // required: true,
    },
    description: {
      type: "String",
    },
    start_date: {
      type: Date,
      default: Date.now,
    },
    end_date: {
      type: Date,
    },
    available: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Gifts", giftSchema);
