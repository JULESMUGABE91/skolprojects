const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const inviteSchema = new Schema(
  {
    organization: {
      type: Schema.Types.ObjectId,
      ref: "Organizations",
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    name: {
      type: "String",
      required: true,
    },
    file: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Providers", inviteSchema);
