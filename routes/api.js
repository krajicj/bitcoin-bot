const express = require("express");
const { protect } = require("../middleware/auth");

//import scheduler functions
const { checkAPIKeys, setAPIKeys, getAPIKeys } = require("../controller/api");

const router = express.Router();

router.route("/valid").get(protect, checkAPIKeys);

router.route("/").get(protect, getAPIKeys);

router.route("/").post(protect, setAPIKeys);

module.exports = router;
