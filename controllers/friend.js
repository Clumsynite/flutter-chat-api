const { handleError, handleBadRequest, handleSuccess } = require("../helper/functions");
const FriendRequest = require("../models/FriendRequest");
const User = require("../models/User");

const createfriendRequest = async (req, res) => {
  try {
    const { to } = req.body;
    const existingRequest = await FriendRequest.findOne({ from: req.user, to });
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

const deletefriendRequest = async (req, res) => {
  try {
    const { to } = req.params;
    const existingRequest = await FriendRequest.findOne({ from: req.user, to });
    if (!existingRequest) return handleBadRequest(res, "Friend Request was already Cancelled!");
    await existingRequest.delete();
    return handleSuccess(res, true);
  } catch (error) {
    return handleError(res, error);
  }
};

const getFriendRequestCount = async (req, res) => {
  try {
    const friendRequests = await FriendRequest.find({ to: req.user });
    return handleSuccess(res, friendRequests.length);
  } catch (error) {
    return handleError(res, error);
  }
};

module.exports = {
  createfriendRequest,
  deletefriendRequest,
  getFriendRequestCount,
};
