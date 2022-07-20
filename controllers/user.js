const { handleError, handleBadRequest, handleSuccess } = require("../helper/functions");
const User = require("../models/User");

const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user);
    if (!user) return handleBadRequest(res, "User not found");
    return handleSuccess(res, { ...user._doc, token: req.token });
  } catch (error) {
    return handleError(res, error);
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user } });
    return handleSuccess(res, users);
  } catch (error) {
    return handleError(res, error);
  }
};

module.exports = { getUser, getAllUsers };
