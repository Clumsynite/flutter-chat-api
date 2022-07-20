const { handleError, handleBadRequest, handleSuccess } = require("../helper/functions");
const Request = require("../models/Request");
const User = require("../models/User");

const createRequest = async (req, res) => {
  try {
    const { to } = req.body;
    const existingRequest = await Request.findOne({ from: req.user, to, status: { $ne: "REJECTED" } });
    if (existingRequest) return handleBadRequest(res, "Friend Request already exists");
    const userToFriend = await User.findById(to);
    if (!userToFriend) return handleBadRequest(res, "User not Found");
    let request = new Request({
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
  createRequest,
};
