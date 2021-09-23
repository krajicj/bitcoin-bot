const cron = require("node-cron");
const model = require("../model/model");
const coinbase = require("./coinbase");
const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");

/**
 * Array of running jobs
 */
const runningJobs = new Map();

/**
 * List of jobs, that can be planed
 */
const listOfJobs = ["buy_btc_eur", "test"];

/****************  API METHODS  *****************/

//TODO get all markets

/**
 * API method to get products
 */
exports.getAvalProducts = asyncHandler(async (req, res, next) => {
  const products = await coinbase.getProducts();
  const productIds = [];
  products.forEach((product) => {
    productIds.push(product.id);
  });

  res.json(productIds);
});

/**
 * API method to get all jobs
 */
exports.getListOfJobs = asyncHandler(async (req, res, next) => {
  const jobs = model.getJobs();
  res.json(jobs);
});

/**
 * API method to get all running jobs
 */
exports.getListOfRunningJobs = asyncHandler(async (req, res, next) => {
  const jobs = model.getJobs();
  const running = jobs.filter((job) => runningJobs.has(job.id));
  res.json(running);
});

/**
 * API method to update existing job
 *
 */
exports.updateJob = asyncHandler(async (req, res, next) => {
  const jobId = req.params.id;
  const jobData = req.body;

  //Check params
  if (!jobId || !jobData) {
    res.json({ status: "error", msg: "Missing job id or job data" });
    return;
  }

  const exist = model.getJob(jobId);
  if (exist) {
    //Delete old job from db
    model.deleteJob(jobId);

    //Update passed job props
    for (const prop in jobData) {
      exist[prop] = jobData[prop];
    }

    //Update job in DB
    const updateJob = model.addJob(exist);

    //Plan job to the scheduler
    planJob(updateJob);

    res.json(updateJob);
  }
});

/**
 * API method to add job
 *
 * This function persist job to the DB and plan it
 *
 * @param {object} job which will be planned
 * @returns planned job
 */
exports.addScheduleJob = asyncHandler(async (req, res, next) => {
  //Job to plan
  const job = req.body;

  //Create unique
  job.id = uuidv4();

  //check existing job
  const exist = model.getJob(job.id);
  if (exist) {
    //Allready existing job with this id
    res.json({ status: "error", msg: "Job with this ID already exists" });
    return;
  }

  //Check if exist function to plan //TODO check from api
  const functionExist = listOfJobs.indexOf(job.functionName) !== -1;
  if (!functionExist) {
    //Function not defined
    res.json({ status: "error", msg: "This market function is not exist" });
    return;
  }

  //Persist job in the db
  const scheduleJob = model.addJob(job);

  //Plan job
  planJob(scheduleJob);

  res.json(scheduleJob);
});

/**
 * API method to delete job
 *
 * Stop planned job and delete them from the db
 *
 * @param {string} id of the job to delete
 * @returns true if delete is successful
 */
exports.deleteJob = asyncHandler(async (req, res, next) => {
  const id = req.params.id;

  //Check if job exist
  const scheduleJob = model.getJob(id);
  if (!scheduleJob) {
    res.json({ status: "error", msg: "Job not exists" });
    return;
  }

  //Delete job from the db
  model.deleteJob(id);

  //Unplan job
  if (runningJobs.has(id)) {
    destroyRunnigJob(id);
  }

  res.json({ status: "success" });
});

/*************** CORE METHODS ****************/

/**
 * Starts job in the database
 * Use this function if you restart the app
 */
exports.startJobs = () => {
  const jobs = model.getJobs();

  jobs.forEach((job) => {
    //Start job if not already started
    if (!runningJobs.has(job.id)) {
      planJob(job);
    }
  });
};

/**
 * Method for add job to the DB from config file
 * only one job per product id can be add from config
 * 
 * @param {*} job
 * @returns
 */
exports.addOrUpdateJob = (job) => {
  if (!job.id) {
    job.id = uuidv4();
  }

  //check existing job
  const jobs = model.getJobs();
  const exist = jobs.find(element => element.orderData.product_id === job.orderData.product_id);
  if (exist) model.deleteJob(job.id);
  return model.addJob(job);
};

/**
 * Plan job to the running jobs
 *
 * @param {object} job to plan
 */
const planJob = function (job) {
  //Scheduler settings
  //  # ┌────────────── second (optional)
  //  # │ ┌──────────── minute
  //  # │ │ ┌────────── hour
  //  # │ │ │ ┌──────── day of month
  //  # │ │ │ │ ┌────── month
  //  # │ │ │ │ │ ┌──── day of week
  //  # │ │ │ │ │ │
  //  # │ │ │ │ │ │
  //  # * * * * * *
  const repeat = `${job.second || ""} ${job.minute} ${job.hour} ${
    job.dayOfMonth
  } ${job.month} ${job.dayOfWeek}`;

  //Unplan job if exist
  if (runningJobs.has(job.id)) {
    destroyRunnigJob(job.id);
  }

  //Schedule selected function
  const scheduledJob = cron.schedule(repeat, () => {
    orderWrapper(job);
  });

  console.log(
    `Planed job '${job.id}' - ${job.orderData.side} ${job.orderData.product_id} for ${job.orderData.funds} repeat string: ${repeat} `
  );

  //Add scheduled job to the running job array
  runningJobs.set(job.id, scheduledJob);
};

/**
 * Wrapper for the coinbase order function
 *
 * @param {object} job
 */
const orderWrapper = async (job) => {
  const orderData = job.orderData;
  if (orderData) {
    if (
      orderData.type &&
      orderData.side &&
      orderData.product_id &&
      orderData.funds
    ) {
      const data = await coinbase.placeOrder(orderData);
      //Log response
      model.addLog(data);
    } else {
      //Log missing order params
    }
  }
};

/**
 * Unplan and destroy runnig job
 *
 * @param {int} jobId id of the job to destroy
 */
const destroyRunnigJob = (jobId) => {
  runningJobs.get(jobId).destroy();
  runningJobs.delete(jobId);
};


/**
 * Only for testing
 *
 * @param {object} job
 */
const test = (job) => {
  console.log(`${job.id} testing this function: ${job.orderData}`);
};
