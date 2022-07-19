const jwt = require("jsonwebtoken");
const { handleError, handleBadRequest } = require("../helper/functions");
const { JWT_SECRET } = require("../config");

const auth = async (req, res, next) => {
  try {
    const token = req.header("x-auth-token");
    if (!token) return handleBadRequest(res, "Token Not Found");
    const isVerified = jwt.verify(token, JWT_SECRET);
    if (!isVerified) return handleBadRequest(res, "Invalid Token");

    req.user = isVerified._id;
    req.token = token;
    return next();
  } catch (error) {
    return handleError(res, error);
  }
};

module.exports = auth;
