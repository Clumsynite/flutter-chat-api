const express = require("express");

const authController = require("../controllers/auth");

const router = express.Router();

router.post("/api/signup", authController.signup);
router.post("/api/signin", authController.signin);

module.exports = router;
