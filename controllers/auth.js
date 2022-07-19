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
    const user = usernameExists._doc;

    const token = jwt.sign({ ...user }, JWT_SECRET);
    return handleSuccess(res, { token, ...user });
  } catch (error) {
    return handleError(res, error);
  }
};

const isTokenValid = async (req, res) => {
  try {
    const token = req.header("x-auth-token");
    if (!token) return res.status(500).json(false);
    const isVerified = jwt.verify(token, JWT_SECRET);
    if (!isVerified) return res.status(500).json(false);

    const decodedToken = jwt.decode(token);
    const user = await User.findById(decodedToken._id);
    if (!user) return res.status(500).json(500);

    return res.status(200).json(true);
  } catch (error) {
    return handleError(res, error);
  }
};

module.exports = {
  signup,
  signin,
  isTokenValid,
};
