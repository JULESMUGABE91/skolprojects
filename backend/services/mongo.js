const mongoose = require("mongoose");
require("dotenv").config();
require("colors");

const MONGO_URL = process.env.MONGO_URL;

mongoose.connection.once("open", () => {
  console.log("MongoDB connected!".cyan.underline);
});

mongoose.connection.on("error", (err) => {
  console.log(`MongoDB error: ${err}`.red.underline.bold);
  process.exit(1);
});

const mongoConnect = async () => {
  await mongoose.connect(MONGO_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });
};

const mongoDisconnect = async () => {
  await mongoose.disconnect();
};

module.exports = {
  mongoConnect,
  mongoDisconnect,
};
