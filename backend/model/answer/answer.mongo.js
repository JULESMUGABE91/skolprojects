const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const startGeoSchema = new Schema({
  type: {
    type: String,
    default: "Point",
  },
  address: {
    type: String,
  },
  coordinates: {
    type: [Number],
    index: { type: "2dsphere", sparse: false },
  },
});

const endGeoSchema = new Schema({
  type: {
    type: String,
    default: "Point",
  },
  address: {
    type: String,
  },
  coordinates: {
    type: [Number],
    index: { type: "2dsphere", sparse: false },
  },
});

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
    survey: {
      type: Schema.Types.ObjectId,
      ref: "Surveys",
    },
    question: {
      type: Schema.Types.ObjectId,
      ref: "Questions",
      required: true,
    },
    answers: {
      type: "Object",
      required: true,
    },
    start_location: startGeoSchema,
    end_location: endGeoSchema,
    identifier: {
      type: String,
      required: true,
    },
    status: {
      type: String,
    },
    last_question: {
      type: Schema.Types.ObjectId,
      ref: "Questions",
    },
    start_interview: {
      type: Number,
    },
    end_interview: {
      type: Number,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Answers", surveySchema);
