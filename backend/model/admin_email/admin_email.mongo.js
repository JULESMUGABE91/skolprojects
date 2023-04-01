const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const adminEmailSchema = new Schema(
  {
    organization: {
      type: Schema.Types.ObjectId,
      ref: "Organizations",
    },
    email: {
      required: true,
      type: "String",
      unique: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AdminEmail", adminEmailSchema);
