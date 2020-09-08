const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "name is required"],
  },
  email: {
    type: String,
    required: [true, "email is required"],
  },
  password: {
    type: String,
    required: [true, "password is required"],
  },
  avatar: {
    type: String,
  },
  registered_at: {
    type: Date,
    default: Date.now(),
  },
  deactivated_at: {
    type: Date,
  },
  friends: {
    type: [mongoose.Types.ObjectId],
    ref: "user",
  },
  friendRequests: {
    type: [mongoose.Types.ObjectId],
    ref: "user",
  },
});

module.exports = User = mongoose.model("user", userSchema);
