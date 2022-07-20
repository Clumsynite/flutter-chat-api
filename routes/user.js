const express = require("express");

const userController = require("../controllers/user");
const auth = require("../middleware/auth");

const router = express.Router();

router.get("/user/all", auth, userController.getAllUsers);
router.get("/user", auth, userController.getUser);

module.exports = router;
