const { handleError, handleSuccess, handleBadRequest } = require("../helper/functions");
const Message = require("../models/Message");
const { handleMessageRead } = require("../socket/message");

const sendMessage = async (req, res) => {
  try {
    const { to, text } = req.body;
    let message = new Message({
      from: req.user,
      to,
      text,
    });
    message = await message.save();
    const emitKey = `message_to_${message.to}_from_${message.from}`;
    req._io.emit(emitKey, message);
    req._io.emit(`${message.to}_unread`, message.from);
    return handleSuccess(res, message);
  } catch (error) {
    return handleError(res, error);
  }
};

const getMessagesForId = async (req, res) => {
  try {
    const { friend } = req.params;
    const promisedMessages = [
      Message.find({ from: friend, to: req.user, deletedByReceiver: { $ne: true } }), // received messages
      Message.find({ from: req.user, to: friend, deletedBySender: { $ne: true } }), // sent messages
    ];

    const resolvedMessages = await Promise.all(promisedMessages);

    let receivedMessages = resolvedMessages[0];
    const sentMessages = resolvedMessages[1];

    const unreadMessages = receivedMessages.filter((message) => message.unread);

    const readPromisedMessages = unreadMessages.map((msg) => handleMessageRead({ id: msg.id, io: req._io }));
    Promise.all(readPromisedMessages);

    receivedMessages = receivedMessages.map((msg) => ({ ...msg._doc, unread: false }));

    const allMessages = [...receivedMessages, ...sentMessages];
    allMessages.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    return handleSuccess(res, allMessages);
  } catch (error) {
    return handleError(res, error);
  }
};

const deleteSelectedMessages = async (req, res) => {
  try {
    const { ids } = req.params;
    const selectedIds = ids.split("&");
    const promisedIds = selectedIds.map((id) => Message.findById(id));
    const resolvedMessages = await Promise.all(promisedIds);

    const promisedDeletions = [];

    for (let i = 0; i < resolvedMessages.length; i += 1) {
      const message = resolvedMessages[i];
      const isSender = message.from === req.user;
      const isReceiver = message.to === req.user;

      if (isSender) {
        message.deletedBySender = true;
      } else if (isReceiver) {
        message.deletedByReceiver = true;
      } else {
        return handleBadRequest(res, { msg: "Not Authorised to delete someone else's message" });
      }
      // if message was delete by both sender and receiver, then remove message from database
      if (message.deletedBySender && message.deletedByReceiver) promisedDeletions.push(message.delete());
      else promisedDeletions.push(message.save());
    }
    await Promise.all(resolvedMessages);
    return handleSuccess(res, true);
  } catch (error) {
    return handleError(res, error);
  }
};

const deleteAllMessages = async (req, res) => {
  try {
    const { friend } = req.params;
    const promisedMessages = [
      Message.find({ from: friend, to: req.user, deletedByReceiver: { $ne: true }, unread: false }), // received messages
      Message.find({ from: req.user, to: friend, deletedBySender: { $ne: true } }), // sent messages
    ];

    const resolvedMessages = await Promise.all(promisedMessages);

    const receivedMessages = resolvedMessages[0];
    const sentMessages = resolvedMessages[1];

    const promisedDeletions = [];

    for (let i = 0; i < receivedMessages.length; i += 1) {
      const message = receivedMessages[i];
      message.deletedByReceiver = true;
      // if message was delete by both sender and receiver, then remove message from database
      if (message.deletedBySender && message.deletedByReceiver) promisedDeletions.push(message.delete());
      else promisedDeletions.push(message.save());
    }

    for (let i = 0; i < sentMessages.length; i += 1) {
      const message = sentMessages[i];
      message.deletedBySender = true;
      // if message was delete by both sender and receiver, then remove message from database
      if (message.deletedBySender && message.deletedByReceiver) promisedDeletions.push(message.delete());
      else promisedDeletions.push(message.save());
    }
    await Promise.all(resolvedMessages);
    return handleSuccess(res, true);
  } catch (error) {
    return handleError(res, error);
  }
};

module.exports = { sendMessage, getMessagesForId, deleteSelectedMessages, deleteAllMessages };
