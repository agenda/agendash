'use strict';
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

function cookie(key, value) {
  return function(req, res, next) {
    if (value) {
      res.cookie(key, value);
    }
    next();
  }
}

module.exports = (agendash, options) => {
  const app = express();
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: false}));
  app.use(cookie('token-key', options.tokenKey));
  app.use('/', express.static(path.join(__dirname, '../../public')));

  app.get('/api', options.apiMiddleware, (req, res) => {
    agendash.api(req.query.job, req.query.state, (err, apiResponse) => {
      if (err) {
        return res.status(400).json(err);
      }
      res.json(apiResponse);
    });
  });

  app.post('/api/jobs/requeue', options.apiMiddleware, (req, res) => {
    agendash.requeueJobs(req.body.jobIds, (err, newJobs) => {
      if (err || !newJobs) {
        return res.status(404).json(err);
      }
      res.json(newJobs);
    });
  });

  app.post('/api/jobs/delete', options.apiMiddleware, (req, res) => {
    agendash.deleteJobs(req.body.jobIds, err => {
      if (err) {
        return res.status(404).json(err);
      }
      return res.json({deleted: true});
    });
  });

  app.post('/api/jobs/create', options.apiMiddleware, (req, res) => {
    agendash.createJob(req.body.jobName, req.body.jobSchedule, req.body.jobRepeatEvery, req.body.jobData, err => {
      if (err) {
        return res.status(404).json(err);
      }
      return res.json({created: true});
    });
  });

  return app;
};
