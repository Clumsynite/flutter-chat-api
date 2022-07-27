const { handleError, handleSuccess } = require("../helper/functions");
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
      Message.find({ from: friend, to: req.user }),
      Message.find({ from: req.user, to: friend }),
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

module.exports = { sendMessage, getMessagesForId };
