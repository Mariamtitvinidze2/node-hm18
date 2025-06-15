const mongoose = require("mongoose");

const PublicMessageSchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  msg: { type: String, required: true },
  timeStamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("PublicMessage", PublicMessageSchema);
