const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  lists: [],
  idstamp: { type: Number, required: true },
});

const UserModel = mongoose.model("users", UserSchema);
module.exports = UserModel;
