const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orgSchema = new Schema(
  {
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    name: {
      type: "String",
      required: true,
    },
    available: {
      type: "Boolean",
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Organization", orgSchema);
