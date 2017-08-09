'use strict';
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

module.exports = agendash => {
  const app = express();
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: false}));
  app.use('/', express.static(path.join(__dirname, '../../public')));

  app.get('/api', (req, res) => {
    agendash.api(req.query.job, req.query.state, (err, apiResponse) => {
      if (err) {
        return res.status(400).json(err);
      }
      res.json(apiResponse);
    });
  });

  app.post('/api/jobs/requeue', (req, res) => {
    agendash.requeueJobs(req.body.jobIds, (err, newJobs) => {
      if (err || !newJobs) {
        return res.status(404).json(err);
      }
      res.json(newJobs);
    });
  });

  app.post('/api/jobs/delete', (req, res) => {
    agendash.deleteJobs(req.body.jobIds, err => {
      if (err) {
        return res.status(404).json(err);
      }
      return res.json({deleted: true});
    });
  });

  app.post('/api/jobs/create', (req, res) => {
    agendash.createJob(req.body.jobName, req.body.jobSchedule, req.body.jobRepeatEvery, req.body.jobData, err => {
      if (err) {
        return res.status(404).json(err);
      }
      return res.json({created: true});
    });
  });

  return app;
};
