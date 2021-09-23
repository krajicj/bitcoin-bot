const express = require("express");
const { protect } = require("../middleware/auth");

//import scheduler functions
const { checkAPIKeys, setAPIKeys } = require("../controller/api");

const router = express.Router();

//List of all running jobs
router.route("/valid").get(protect, checkAPIKeys);

//Add new job
router.route("/").post(protect, setAPIKeys);

module.exports = router;
