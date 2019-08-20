const mongoose = require("mongoose");
const ChatMessageSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  session: { type: mongoose.Schema.Types.ObjectId, ref: "Session" },
  content: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = ChatMessage = mongoose.model("ChatMessage", ChatMessageSchema);
