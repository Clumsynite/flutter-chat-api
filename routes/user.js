const express = require("express");

const userController = require("../controllers/user");
const auth = require("../middleware/auth");

const router = express.Router();

router.put("/user/details", auth, userController.updateUserDetails); // update optional user details
router.put("/user/password", auth, userController.changePassword); // update optional user details
router.get("/user/all", auth, userController.getAllUsers);
router.get("/user", auth, userController.getUser);

module.exports = router;
