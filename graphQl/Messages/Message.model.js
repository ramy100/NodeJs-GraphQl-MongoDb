const mongoose = require("mongoose");

const messagesSchema = new mongoose.Schema({
  from: {
    type: mongoose.Types.ObjectId,
    ref: "user",
    required: true,
  },
  to: {
    type: mongoose.Types.ObjectId,
    ref: "user",
    required: true,
  },
  content: {
    type: String,
  },
  created_at: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = Message = mongoose.model("message", messagesSchema);
