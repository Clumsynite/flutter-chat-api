const express = require("express");

const friendController = require("../controllers/friend");
const auth = require("../middleware/auth");

const router = express.Router();

router.get("/friend-request/to", auth, friendController.getFriendRequestsReceived);
router.get("/friend/count", auth, friendController.getFriendRequestCount);
router.post("/friend/", auth, friendController.createfriendRequest);
router.delete("/friend/:to", auth, friendController.deletefriendRequest);

module.exports = router;
