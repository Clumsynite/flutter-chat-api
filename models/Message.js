const mongoose = require("mongoose");

const MessageSchema = mongoose.Schema(
  {
    from: { type: String, required: true },
    to: { type: String, required: true },
    text: { type: String, required: true },
    unread: { type: Boolean, default: true },
    deletedBySender: { type: Boolean }, // from
    deletedByReceiver: { type: Boolean }, // to
    // if send and receiver, both delete a message
    // then, the message document is removed from the database
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", MessageSchema);
module.exports = Message;
