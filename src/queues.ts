
import Queue from 'bull';
import { REDIS_URL } from './config';


const FunctionScheduleQueue = new Queue('Function_Scheduled', REDIS_URL)
  
// Notes: https://github.com/OptimalBits/bull

FunctionScheduleQueue.process(function(job, done){

  // job.data contains the custom data passed when the job was created
  // job.id contains id of this job.

  // transcode video asynchronously and report progress
  job.progress(42);

  // call done when finished
  done();

  // or give a error if error
  // done(new Error('error transcoding'));

  // or pass it a result
  // done(null, { framerate: 29.5 /* etc... */ });

  // If the job throws an unhandled exception it is also handled correctly
  // throw new Error('some unexpected error');
});

const EnqueueScheduleQueue= new Queue('Enqueue_Schedules', REDIS_URL)
  
function makeid(length:number) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

EnqueueScheduleQueue.process(function(job, done){

  var functionName = "Function " + makeid(2);

  FunctionScheduleQueue.add({name: functionName});

  // job.data contains the custom data passed when the job was created
  // job.id contains id of this job.

  // transcode video asynchronously and report progress
  job.progress(42);

  

  // call done when finished
  done();

  // or give a error if error
  // done(new Error('error transcoding'));

  // or pass it a result
  // done(null, { framerate: 29.5 /* etc... */ });

  // If the job throws an unhandled exception it is also handled correctly
  // throw new Error('some unexpected error');
});

const CronEveryMinute = "* * * * *"
EnqueueScheduleQueue.add({}, {repeat: {cron: CronEveryMinute}});

export const queues = [
  FunctionScheduleQueue,
  EnqueueScheduleQueue
]