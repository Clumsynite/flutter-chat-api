const User = require("../models/User");

const handleClientOnline = async ({ id, io }) => {
  const user = await User.findById(id);
  if (user) {
    user.isOnline = true;
    await user.save();
    for (let i = 0; i < user.friends.length; i += 1) {
      const emitKey = `${user.friends[i]}_online`;
      io.emit(emitKey, id);
    }
  }
};

const handleClientOffline = async ({ id, io }) => {
  const user = await User.findById(id);
  if (user) {
    user.isOnline = false;
    user.lastSeen = (new Date()).toISOString();
    await user.save();
    for (let i = 0; i < user.friends.length; i += 1) {
      const emitKey = `${user.friends[i]}_offline`;
      io.emit(emitKey, id);
    }
  }
};

module.exports = {
  handleClientOnline,
  handleClientOffline,
};
