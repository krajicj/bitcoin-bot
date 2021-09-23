const express = require("express");
const { protect } = require("../middleware/auth");

//import scheduler functions
const { changePassword } = require("../controller/locker");

const router = express.Router();

//Add new job
router.route("/").put(protect, changePassword);

module.exports = router;
