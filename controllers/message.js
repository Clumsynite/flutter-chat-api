const { handleError, handleSuccess } = require("../helper/functions");
const Message = require("../models/Message");

const sendMessage = async (req, res) => {
  try {
    const { to, text } = req.body;
    let message = new Message({
      from: req.user,
      to,
      text,
    });
    message = await message.save();
    req._io.emit(`${to}_message_sent`);
    req._io.emit(`${req.user}_message_sent`);
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
    const allMessages = [...resolvedMessages[0], ...resolvedMessages[1]];
    allMessages.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    return handleSuccess(res, allMessages);
  } catch (error) {
    return handleError(res, error);
  }
};

module.exports = { sendMessage, getMessagesForId };
