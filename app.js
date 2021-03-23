const fs = require('fs');

const scheduler = require('./scheduler');
const express = require('express');

const model = require('./model');
const utils = require('./utils');


//Create express
app = express();

//Add job from config if exist
const initConfig = fs.readFileSync('./config/job.json');
if(utils.isJson(initConfig)){
    const initJob = JSON.parse(initConfig);
    if(initJob.id){
        scheduler.addOrUpdateJob(initJob);
    }
}

//Starts all jobs
scheduler.startJobs();

//Start the server
app.listen(3000);   



