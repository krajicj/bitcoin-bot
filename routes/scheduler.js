const express = require("express");
const { protect } = require("../middleware/auth");

//import scheduler functions
const {
  getListOfRunningJobs,
  getListOfJobs,
  addScheduleJob,
  deleteJob,
  updateJob ,
  getAvalProducts
} = require("../controller/scheduler");


const router = express.Router();

//List of all running jobs
router.route("/running/").get(protect, getListOfRunningJobs);

//List of all running jobs
router.route("/all/").get(protect, getListOfJobs);

//List of all running jobs
router.route("/products/").get(protect, getAvalProducts);

//Add new job
router.route("/").post(protect, addScheduleJob);

//Update and delete specified job
router.route("/:id")
.put(protect, updateJob)
.delete(protect, deleteJob);


module.exports = router;



