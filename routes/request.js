const express = require("express");

const requestController = require("../controllers/request");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/request/", auth, requestController.createRequest);

module.exports = router;
