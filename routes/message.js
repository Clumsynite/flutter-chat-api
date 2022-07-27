const express = require("express");

const messageController = require("../controllers/message");
const auth = require("../middleware/auth");

const router = express.Router();

router.get("/message/from/:friend", auth, messageController.getMessagesForId); // get a list of all messages from a user
router.post("/message/", auth, messageController.sendMessage); // send a new message and notify user of the new message
router.delete("/message/from/:friend", auth, messageController.deleteAllMessages); // send a new message and notify user of the new message
router.delete("/message/:ids", auth, messageController.deleteSelectedMessages); // send a new message and notify user of the new message

module.exports = router;
