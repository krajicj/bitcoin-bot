const {JsonDB}  = require('node-json-db');
const {Config} = require('node-json-db/dist/lib/JsonDBConfig');

const db = new JsonDB(new Config("./model/data", true, true, '.'));



/**
 * @param {string} id of the job
 * @returns all jobs in the data file
 */
 exports.getJob = (id) => {
   try{
     return db.getData(".jobs").find(element => element.id === id);
   }catch(error){
      console.log('DB file not exist yet');
   }
}


/**
 * 
 * @returns all jobs in the data file
 */
exports.getJobs = () => {
  try{
    return db.getData(".jobs");
  }catch(err){
    return [];    
  }
}

/**
 * Persit job to the file
 * 
 * @param {object} job job settings 
 */
exports.addJob = (job) => {

  //Create job with default values
  const sanitizedJob = {
    second: job.second || null,
    minute: job.minute || '*',
    hour: job.hour || '*',
    dayOfMonth: job.dayOfMonth || '*',
    month: job.month || '*',
    dayOfWeek: job.dayOfWeek || '*',
    orderData: job.orderData || {},    
    id: job.id || Date.now()
    }

  db.push("jobs",{jobs: [sanitizedJob]}, false)
  return job;
}


/**
 * 
 *  Delete job by id
 * @param {string} id of the job
 */
 exports.deleteJob = (id) => {
  db.delete(".jobs[" + db.getIndex(".jobs", id) + "]");
}


/**
 * Persit log to the file
 * 
 * @param {object} log object to log
 */
 exports.addLog = (log) => {
  db.push("logs",{logs: [log]}, false)
  return log;
}



