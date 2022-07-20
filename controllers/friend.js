const { handleError, handleBadRequest, handleSuccess } = require("../helper/functions");
const FriendRequest = require("../models/FriendRequest");
const User = require("../models/User");

const createfriendRequest = async (req, res) => {
  try {
    const { to } = req.body;
    const existingRequest = await FriendRequest.findOne({ from: req.user, to, status: { $ne: "REJECTED" } });
    if (existingRequest) return handleBadRequest(res, "Friend Request already exists");
    const userToFriend = await User.findById(to);
    if (!userToFriend) return handleBadRequest(res, "User not Found");
    let request = new FriendRequest({
      from: req.user,
      to,
    });
    request = await request.save();
    return handleSuccess(res, request);
  } catch (error) {
    return handleError(res, error);
  }
};

module.exports = {
  createfriendRequest,
};
