var express = require('express')
var bodyParser = require('body-parser')
var path = require('path')

module.exports = (agendash) => {
  var app = express()
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: false }))
  app.use('/', express.static(path.join(__dirname, '../../public')))

  app.get('/api', function (req, res, next) {
    agendash.api(req.query.job, req.query.state, function (err, apiResponse) {
      if (err) return res.status(400).json(err)
      res.json(apiResponse)
    })
  })

  app.post('/api/jobs/requeue', function (req, res, next) {
    agendash.requeueJobs(req.body.jobIds, function (err, newJobs) {
      if (err || !newJobs) return res.status(404).json(err)
      res.json(newJobs)
    })
  })

  app.post('/api/jobs/delete', function (req, res, next) {
    agendash.deleteJobs(req.body.jobIds, function (err, deleted) {
      if (err) return res.status(404).json(err)
      return res.json({deleted: true})
    })
  })

  app.post('/api/jobs/create', function (req, res, next) {
    agendash.createJob(req.body.jobName, req.body.jobSchedule, req.body.jobRepeatEvery, req.body.jobData, function (err, deleted) {
      if (err) return res.status(404).json(err)
      return res.json({created: true})
    })
  })

  return app
}
