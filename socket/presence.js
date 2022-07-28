const User = require("../models/User");

const handleClientOnline = async ({ id, io, client }) => {
  const user = await User.findById(id);
  if (user) {
    user.isOnline = true;
    user.socketId = client.id;
    await user.save();
    for (let i = 0; i < user.friends.length; i += 1) {
      const emitKey = `${user.friends[i]}_online`;
      io.emit(emitKey, id);
    }
  }
};

const handleClientOffline = async ({ id, io, isForced }) => {
  const user = await User.findById(id);
  if (isForced) io.emit(`${user._id}_logout`);
  if (user) {
    user.isOnline = false;
    user.lastSeen = new Date().toISOString();
    user.socketId = undefined;
    await user.save();
    for (let i = 0; i < user.friends.length; i += 1) {
      const emitKey = `${user.friends[i]}_offline`;
      io.emit(emitKey, id);
    }
  }
};

const handleClientTyping = async ({ data, io }) => {
  const { userId, isTyping } = data;
  io.emit(`${userId}_typing`, isTyping);
  const user = await User.findById(userId);
  for (let i = 0; i < user.friends.length; i += 1) {
    io.emit(`${user.friends[i]}_friend_typing`, { userId, isTyping });
  }
};

const hdnleClientDisconnect = async ({ client, io }) => {
  const user = await User.findOne({ socketId: client.id });
  if (user) handleClientOffline({ id: user.id, io, isForced: true });
};

module.exports = {
  handleClientOnline,
  handleClientOffline,
  handleClientTyping,
  hdnleClientDisconnect,
};
