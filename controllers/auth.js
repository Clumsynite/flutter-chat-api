const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");

const { handleBadRequest, handleSuccess, handleError } = require("../helper/functions");
const User = require("../models/User");

const signup = async (req, res) => {
  try {
    const { username, email, firstName, lastName, avatar, password } = req.body;

    const userWithSameUsername = await User.findOne({ username });
    if (userWithSameUsername) return handleBadRequest(res, "User with same username already exists!");

    const userWithSameEmail = await User.findOne({ email });
    if (userWithSameEmail) return handleBadRequest(res, "User with same email already exists!");

    const hashedPassword = await bcryptjs.hash(password, 8);

    let user = new User({
      username,
      email,
      firstName,
      lastName,
      avatar,
      password: hashedPassword,
    });
    user = await user.save();
    return handleSuccess(res, user._doc);
  } catch (error) {
    return handleError(res, error);
  }
};

const signin = async (req, res) => {
  try {
    const { username, password } = req.body;
    const usernameExists = await User.findOne({ username });
    if (!usernameExists) return handleBadRequest(res, "Username or password doesn't match");

    const passwordMatches = await bcryptjs.compare(password, usernameExists.password);
    if (!passwordMatches) return handleBadRequest(res, "Username or password doesn't match");

    const token = jwt.sign({ user: usernameExists._id }, JWT_SECRET);
    const user = usernameExists._doc;
    return handleSuccess(res, { token, ...user });
  } catch (error) {
    return handleError(res, error);
  }
};

module.exports = {
  signup,
  signin,
};