const Message = require("../models/Message");

const handleMessageRead = async ({ id, io }) => {
  const message = await Message.findById(id);
  message.unread = false;
  await message.save();
  io.emit(`${message.to}_read`, message.from);
};

module.exports = {
  handleMessageRead,
};
