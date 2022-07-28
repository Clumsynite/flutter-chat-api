const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { JWT_SECRET } = require("../config");
const { handleError, handleBadRequest, handleSuccess } = require("../helper/functions");
const FriendRequest = require("../models/FriendRequest");
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
    const friendRequests = await FriendRequest.find({ from: req.user });
    const requestedContacts = friendRequests.map((x) => x.to);
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

      // if contact is not already a friend, check if user had sent a friend request
      if (!isFriend) contactObject.isRequested = requestedContacts.includes(_id.toString());
      return contactObject;
    });
    return handleSuccess(res, mappedUsers);
  } catch (error) {
    return handleError(res, error);
  }
};

const updateUserDetails = async (req, res) => {
  try {
    const { firstName, lastName, email } = req.body;
    const user = await User.findById(req.user);
    if (!user) return handleBadRequest(res, "User not found");

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (email) user.email = email;

    await user.validate();
    await user.save();

    return handleSuccess(res, { ...user._doc, token: req.token });
  } catch (error) {
    return handleError(res, error);
  }
};

const changePassword = async (req, res) => {
  try {
    const { newPassword } = req.body;
    const user = await User.findById(req.user);
    if (!user) return handleBadRequest(res, "User not found");

    if (newPassword) {
      const hashedPassword = await bcryptjs.hash(newPassword, 8);
      user.password = hashedPassword;
    }

    await user.validate();
    await user.save();
    const token = jwt.sign({ ...user._doc }, JWT_SECRET);

    return handleSuccess(res, { ...user._doc, token });
  } catch (error) {
    return handleError(res, error);
  }
};

module.exports = { getUser, getAllUsers, updateUserDetails, changePassword };
