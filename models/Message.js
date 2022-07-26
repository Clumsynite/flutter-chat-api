const mongoose = require("mongoose");

const MessageSchema = mongoose.Schema(
  {
    from: { type: String, required: true },
    to: { type: String, required: true },
    text: { type: String, required: true },
    unread: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", MessageSchema);
module.exports = Message;
