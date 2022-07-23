const { handleError, handleBadRequest, handleSuccess } = require("../helper/functions");
const FriendRequest = require("../models/FriendRequest");
const User = require("../models/User");

// create a friend request
const createfriendRequest = async (req, res) => {
  try {
    const { to } = req.body;
    const existingRequest = await FriendRequest.findOne({ from: req.user, to });
    if (existingRequest) return handleBadRequest(res, "Friend Request already exists");
    const userToFriend = await User.findById(to);
    if (!userToFriend) return handleBadRequest(res, "User not Found");

    // check if there is already an incoming request from contact
    const incomingRequest = await FriendRequest.findOne({ from: to, to: req.user });
    if (incomingRequest) {
      // if an incoming request exists, accept that request and add contact to friend list
      const currrentUser = await User.findById(req.user);
      if (currrentUser.friends.includes(to)) {
        return handleBadRequest(res, "Friend Request Already Accepted!");
      }

      currrentUser.friends.push(to);
      if (!userToFriend.friends.includes(req.user)) userToFriend.friends.push(req.user);

      await incomingRequest.delete();
      await currrentUser.save();
      await userToFriend.save();
    } else {
      // if no incoming request exists, create a new request
      const request = new FriendRequest({
        from: req.user,
        to,
      });
      await request.save();
    }
    req._io.emit(`${to}_friend`, true);
    req._io.emit(`${req.user}_friend`, true);
    return handleSuccess(res, { msg: "AAA" });
  } catch (error) {
    return handleError(res, error);
  }
};

// used to cancel a friend request send from user
// request id is not available in this case
const deletefriendRequest = async (req, res) => {
  try {
    const { to } = req.params;
    const existingRequest = await FriendRequest.findOne({ from: req.user, to });
    if (!existingRequest) return handleBadRequest(res, "Friend Request was already Cancelled!");
    await existingRequest.delete();
    req._io.emit(`${to}_friend`, false);
    return handleSuccess(res, true);
  } catch (error) {
    return handleError(res, error);
  }
};

// get number of requests pending to be accepted\rejectd
const getFriendRequestCount = async (req, res) => {
  try {
    const friendRequests = await FriendRequest.find({ to: req.user });
    return handleSuccess(res, friendRequests.length);
  } catch (error) {
    return handleError(res, error);
  }
};

// get a list of friend requests
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

// accept an incoming friend request
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
    req._io.emit(`${user._id.toString()}_friend`, true);
    req._io.emit(`${contact._id.toString()}_friend`, true);

    return handleSuccess(res, "Friend Request Accepted Successfully!");
  } catch (error) {
    return handleError(res, error);
  }
};

// reject an incoming friend request
// reques id is available in this case
const cancelFriendRequest = async (req, res) => {
  try {
    const { _id } = req.body;

    const friendRequest = await FriendRequest.findById(_id);
    if (!friendRequest) return handleBadRequest(res, "Friend Request Not Found");

    await friendRequest.delete();
    req._io.emit(`${friendRequest.to.toString()}_friend`, true);
    return handleSuccess(res, "Friend Request Cancelled Successfully!");
  } catch (error) {
    return handleError(res, error);
  }
};

// remove friend from user's friend list
const removeFriend = async (req, res) => {
  try {
    const { _id } = req.params;

    const user = await User.findById(req.user);
    const contact = await User.findById(_id);

    if (!user || !contact) return handleBadRequest(res, "Profile not found!");

    const userFriends = [...user.friends].filter((friend) => friend !== _id);
    const contactFriends = [...contact.friends].filter((friend) => friend !== req.user);

    user.friends = userFriends;
    contact.friends = contactFriends;

    await user.save();
    await contact.save();

    req._io.emit(`${contact._id.toString()}_friend`, true);
    return handleSuccess(res, "Friend Removed Successfully!");
  } catch (error) {
    return handleError(res, error);
  }
};

// get all contacts from a user's friends list
const getAllFriends = async (req, res) => {
  try {
    const user = await User.findById(req.user);
    const promisedFriends = user.friends.map((friend) => User.findById(friend));
    const resolvedFriends = await Promise.all(promisedFriends);
    const mappedFriends = [];
    for (let i = 0; i < resolvedFriends.length; i += 1) {
      const { _id, username, email, firstName, lastName, avatar, isOnline, lastSeen, createdAt } = resolvedFriends[i];
      const friendObj = { _id, username, email, firstName, lastName, avatar, isOnline, lastSeen, createdAt };
      mappedFriends.push(friendObj);
    }
    return handleSuccess(res, mappedFriends);
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
  cancelFriendRequest,
  removeFriend,
  getAllFriends,
};
