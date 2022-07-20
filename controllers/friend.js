const { handleError, handleBadRequest, handleSuccess } = require("../helper/functions");
const FriendRequest = require("../models/FriendRequest");
const User = require("../models/User");

const createfriendRequest = async (req, res) => {
  try {
    const { to } = req.body;
    // TODO - if user has sent a friend request and contact creates another request for user
    // TODO - consider that as accepted and go with accept friend request logic
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

const getFriendRequestsReceived = async (req, res) => {
  try {
    const friendRequests = await FriendRequest.find({ to: req.user });
    const mappedFriendRequests = [];
    const promiseContacts = [];

    friendRequests.forEach((request) => promiseContacts.push(User.findById(request.from)));

    const resolvedContacts = await Promise.all(promiseContacts);
    for (let i = 0; i < friendRequests.length; i += 1) {
      const request = friendRequests[i];
      const contact = resolvedContacts.find((x) => x._id.toString() === request.from);
      const { _id, username, email, firstName, lastName, avatar, isOnline } = contact;
      const contactObject = {
        _id,
        username,
        email,
        firstName,
        lastName,
        avatar,
        isOnline,
        isFriend: false,
      };

      const requestObject = {
        ...request._doc,
        contact: contactObject,
      };
      mappedFriendRequests.push(requestObject);
    }
    return handleSuccess(res, mappedFriendRequests);
  } catch (error) {
    return handleError(res, error);
  }
};

const acceptFriendRequest = async (req, res) => {
  try {
    const { _id } = req.body;

    const friendRequest = await FriendRequest.findById(_id);
    if (!friendRequest) return handleBadRequest(res, "Friend Request Not Found");

    const user = await User.findById(req.user);
    if (user.friends.includes(friendRequest.from.toString())) {
      return handleBadRequest(res, "Friend Request Already Accepted!");
    }

    user.friends.push(friendRequest.from);
    const contact = await User.findById(friendRequest.from);
    if (!contact.friends.includes(req.user)) contact.friends.push(req.user);

    await friendRequest.delete();
    await user.save();
    await contact.save();
    return handleSuccess(res, "Friend Request Accepted Successfully!");
  } catch (error) {
    return handleError(res, error);
  }
};

module.exports = {
  createfriendRequest,
  deletefriendRequest,
  getFriendRequestCount,
  getFriendRequestsReceived,
  acceptFriendRequest,
};
