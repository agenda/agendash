const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

module.exports = agendash => {
  const { api, requeueJobs, deleteJobs, createJob} = agendash
  const app = express();
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: false}));
  app.use('/', express.static(path.join(__dirname, '../../public')));

  app.get('/api', (req, res) => {
    let { job, state, skip, limit, q, property, isObjectId } = req.query;
    api(job, state, {query: q, property, isObjectId, skip, limit})
      .then( apiResponse => res.json(apiResponse))
      .catch( err => {
        res.status(400).json(err)
      })
  });

  app.post('/api/jobs/requeue', (req, res) => {
    requeueJobs(req.body.jobIds)
      .then( newJobs => res.send(newJobs))
      .catch( err => res.status(404).json(err))

  });

  app.post('/api/jobs/delete', (req, res) => {
    deleteJobs(req.body.jobIds)
      .then( deleted => {
        if(deleted){
          return res.json({deleted: true})
        } else {
          return res.json({message: 'Jobs not deleted'})
        }
      })
      .catch( err => res.status(404).json(err))
  });

  app.post('/api/jobs/create', (req, res) => {
    createJob(req.body.jobName, req.body.jobSchedule, req.body.jobRepeatEvery, req.body.jobData)
      .then( () => res.json({created: true}))
      .catch( err => res.status(400).json(err))
  });

  return app;
};
