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
    const mappedUsers = users.map((user) => {
      const { _id, username, email, firstName, lastName, avatar, isOnline } = user;
      const contactObject = {
        _id,
        username,
        email,
        firstName,
        lastName,
        avatar,
        isOnline,
      };

      const isFriend = user.friends.includes(req.user);
      contactObject.isFriend = isFriend;

      return contactObject;
    });
    return handleSuccess(res, mappedUsers);
  } catch (error) {
    return handleError(res, error);
  }
};

module.exports = { getUser, getAllUsers };
