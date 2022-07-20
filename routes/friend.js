const express = require("express");

const friendController = require("../controllers/friend");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/friend/", auth, friendController.createfriendRequest);

module.exports = router;
