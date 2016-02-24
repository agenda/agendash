var express = require('express')
var bodyParser = require('body-parser')
var path = require('path')
var agendash

var app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, '/../public')))

app.get('/api', function (req, res, next) {
  agendash.api(req.query.job, req.query.state, function (err, apiResponse) {
    if (err) return res.status(400).json(err)
    res.json(apiResponse)
  })
})

app.post('/api/job/:id/requeue', function (req, res, next) {
  agendash.requeueJob(req.params.id, function (err, newJob) {
    if (err || !newJob) return res.status(404).json(err)
    res.json(newJob)
  })
})

app.post('/api/job/:id/delete', function (req, res, next) {
  agendash.deleteJob(req.params.id, function (err, deleted) {
    if (err) return res.status(404).json(err)
    return res.json({deleted: true})
  })
})

module.exports = function (_agenda) {
  agendash = require('../agendash')(_agenda)
  return app
}
