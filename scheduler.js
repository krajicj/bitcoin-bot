const cron = require('node-cron');
const model = require('./model');
const coinbase = require('./coinbase');


/**
 * Array of running jobs
 */
const runningJobs = new Map();

/**
 * List of jobs, that can be planed
 */
const listOfJobs = [
    'buy_btc_eur', 
    'test'
];

/**
 * Starts job in the database
 * Use this function if you restart the app
 */
exports.startJobs = () =>{
    const jobs = model.getJobs();

    jobs.forEach(job => {        
        //Start job if not allready started
        if(!runningJobs.has(job.id)){       
            planJob(job);
        }
    });


}

exports.addOrUpdateJob = (job) => {
  //check existing job
  const exist = model.getJob(job.id);
  if(exist) model.deleteJob(job.id);
  model.addJob(job);

}


/**
 * This function persist job to the DB and plan it
 * 
 * @param {object} job which will be planned
 * @returns planned job
 */
exports.addScheduleJob = (job) => {
   
    //check existing job
    const exist = model.getJob(job.id);
    if(exist) return null; //Allready existing job with this id

    //Check if exist function to plan
    const functionExist = (listOfJobs.indexOf(job.functionName) !== -1);
    if(!functionExist) return null; //Function not defined
    
    //Persist job in the db
    const scheduleJob = model.addJob(job);

    //Plan job
    planJob(scheduleJob)
    
    return scheduleJob;

}

/**
 * Stop planned hob and delete them from the db
 * 
 * @param {string} id of the job to delete
 * @returns true if delete is successful
 */
exports.deleteJob = function (id) {
    //Check if job exist
    const scheduleJob = model.getJob(id);
    if (!scheduleJob) return false;
    
    //Delete job from the db
    model.deleteJob(id);

    //Unplan job
    if(runningJobs.has(id)){
        destroyRunnigJob(id);
    }

    return true;

}

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
    const repeat = `${job.second || ''} ${job.minute} ${job.hour} ${job.dayOfMonth} ${job.month} ${job.dayOfWeek}`;

    //Unplan job if exist
    if(runningJobs.has(job.id)){
        destroyRunnigJob(job.id);
    }


    //Schedule selected function
    const scheduledJob = cron.schedule(repeat, () => {
        switch (job.functionName) {
            case 'buy_btc_eur':  buyBtcEur(job); break;
            case 'test': test(job); break;
        }
    });

    console.log(`Planed job '${job.id}' with function '${job.functionName}' repeat string: ${repeat} `);

    //Add scheduled job to the running job array
    runningJobs.set(job.id, scheduledJob);
}


/**
 * Wrapper for the coinbase function to buy a BTC for EUR
 * 
 * @param {object} job which call this function 
 */
const buyBtcEur = async (job) => {
    //if job data has amount then call coinbase module function
    if(job.functionData.amount){
       const data = await coinbase.buyBtcForEur(job.functionData.amount);
       //Log response
       model.addLog(data);
    }   

}

/**
 * Unplan and destroy runnig job
 * 
 * @param {int} jobId id of the job to destroy 
 */
const destroyRunnigJob = (jobId) =>{
    runningJobs.get(jobId).destroy();
    runningJobs.delete(jobId);
}

/**
 * Only for testing
 * 
 * @param {object} job 
 */
const test = (job) => {
    console.log(`${job.id} testing this function: ${job.functionName}`);
}




