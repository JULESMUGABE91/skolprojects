const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schemaSchema = new Schema(
  {
    gender: {
      type: "String",
      required: true,
    },
    count: {
      type: "Number",
    },
    region: {
      type: "Object",
    },
    ageGroup: {
      type: "Object",
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
  },
  { timestamps: true }
);

module.exports = mongoose.model("Genders", schemaSchema);
