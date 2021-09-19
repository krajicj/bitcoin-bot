//load env vars
const dotenv = require('dotenv');
dotenv.config({ path: './config/config.env' });
const fs = require('fs');

const scheduler = require('./controller/scheduler');
const express = require('express');

const model = require('./model/model');
const utils = require('./utils/utils');

const locker = require('./controller/locker');
const auth = require('./routes/auth');

const mainApp = async() =>{

//Check main password or set it if it is firt run of the app
await locker.checkPassword();

//Add job from config if exist
const initConfig = fs.readFileSync('./config/job.json');
if(utils.isJson(initConfig)){
    const initJob = JSON.parse(initConfig);
    if(initJob.id){
        scheduler.addOrUpdateJob(initJob);
    }
}

//Starts all jobs
//scheduler.startJobs();


//Start the server
app = express();

app.use(express.json()); // for parsing request body
app.use('/api/v1', auth);


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`);
})


//TESTING
//console.log(process.env.PASS);
//console.log(process.env.MAIN_PASSWORD);


}

mainApp();


