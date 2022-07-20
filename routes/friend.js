const express = require("express");

const friendController = require("../controllers/friend");
const auth = require("../middleware/auth");

const router = express.Router();

router.get("/friend-request/to", auth, friendController.getFriendRequestsReceived); // get a list of all received friend requests
router.get("/friend-request/count", auth, friendController.getFriendRequestCount); // get friend request count
router.post("/friend-request/cancel", auth, friendController.cancelFriendRequest); // cancel friend request by request id
router.post("/friend-request/", auth, friendController.createfriendRequest); // create new friend request
router.delete("/friend-request/:to", auth, friendController.deletefriendRequest); // delete friend request by contact id

router.post("/friend/", auth, friendController.acceptFriendRequest); // accept friend request

module.exports = router;
