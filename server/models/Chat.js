const mongoose = require("mongoose");

const ChatSchema = new mongoose.Schema({
  roomId: { type: String, required: true },
  userEmail: { type: String, required: true },
  msg: { type: String, required: true },
  timeStamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Chat", ChatSchema);
