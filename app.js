//load env vars
const dotenv = require("dotenv");
dotenv.config({ path: "./config/config.env" });
const fs = require("fs");
const cors = require("cors");

const scheduler = require("./controller/scheduler");
const express = require("express");

const model = require("./model/model");
const utils = require("./utils/utils");

const locker = require("./controller/locker");

//ROUTES
const auth = require("./routes/auth");
const schedulerRoute = require("./routes/scheduler");
const apiKeys = require("./routes/api");
const lockerRoute = require("./routes/locker");

//Main app function
const mainApp = async () => {
  //Check main password or set it if it is firt run of the app
  await locker.checkPassword();

  //Add job from config if exist
  const initConfig = fs.readFileSync("./config/job.json");
  if (utils.isJson(initConfig)) {
    const initJob = JSON.parse(initConfig);
    scheduler.addOrUpdateJob(initJob);
  }

  //Starts all jobs
  scheduler.startJobs();

  //Start the server
  app = express();

  app.use(express.json()); // for parsing request body

  app.use(cors());

  app.use("/api/v1", auth);
  app.use("/api/v1/jobs", schedulerRoute);
  app.use("/api/v1/keys", apiKeys);
  app.use("/api/v1/locker", lockerRoute);

  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    console.log(
      `Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`
    );
  });

  //TESTING
  //console.log(process.env.PASS);
  //console.log(process.env.MAIN_PASSWORD);
};

mainApp();

