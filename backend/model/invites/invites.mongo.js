const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const inviteSchema = new Schema(
  {
    organization: {
      type: Schema.Types.ObjectId,
      ref: "Organizations",
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    link: {
      type: "String",
      required: true,
    },
    count: {
      type: Number,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Invites", inviteSchema);
