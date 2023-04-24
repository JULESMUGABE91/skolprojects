const { default: mongoose } = require("mongoose");

//IMPORT SCHEMA

const DATA = [];

module.exports = async (params) => {
  for (let el of DATA) {
    const users = await userMongo.find({ phone: el.phone }).count();

    if (users === 0) {
      await userMongo.create({
        _id: mongoose.Types.ObjectId(el._id),
        ...el,
      });
    }
  }
};
