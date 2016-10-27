/* global describe, it, before */
var supertest = require('supertest')
var express = require('express')
var Agenda = require('agenda')
var agenda = new Agenda().database(
  'mongodb://127.0.0.1/agendash-test-db',
  'agendash-test-collection'
)
var app = express()
app.use('/', require('../app')(agenda))
var request = supertest(app)

before(function (done) {
  agenda.on('ready', function (err) {
    if (err) throw err
    done()
  })
})

describe('GET /api with no jobs', function () {
  before(function (done) {
    agenda._collection.deleteMany({}, null, function (err, res) {
      if (err) throw err
      if (!res.result.ok) throw new Error('Did not clear test collection.')
      done()
    })
  })
  it('should return the correct overview', function (done) {
    request.get('/api')
    .expect(200)
    .expect(function (res) {
      if (!res.body.overview) throw new Error('No overview')
      if (res.body.overview[0].displayName !== 'All Jobs') throw new Error('Does not show All Jobs')
      if (res.body.jobs.length !== 0) throw new Error('Jobs array is not empty')
    })
    .end(done)
  })
})

describe('POST /api/jobs/create', function () {
  before(function (done) {
    agenda._collection.deleteMany({}, null, function (err, res) {
      if (err) throw err
      if (!res.result.ok) throw new Error('Did not clear test collection.')
      done()
    })
  })
  it('should confirm the job exists', function (done) {
    request.post('/api/jobs/create')
    .send({
      jobName: 'Test Job',
      jobSchedule: 'in 2 minutes',
      jobRepeatEvery: '',
      jobData: {}
    })
    .set('Accept', 'application/json')
    .expect(200)
    .expect(function (res) {
      if (!res.body.created) throw new Error('Not created')
    })
    .end(function () {
      agenda._collection.count({}, null, function (err, res) {
        if (err) throw err
        if (res !== 1) throw new Error('Expected one document in database')
        done()
      })
    })
  })
})

describe('POST /api/jobs/delete', function () {
  var job
  before(function (done) {
    agenda._collection.deleteMany({}, null, function (err, res) {
      if (err) throw err
      if (!res.result.ok) throw new Error('Did not clear test collection.')
      agenda.create('Test Job', {})
      .schedule('in 4 minutes')
      .save(function (err, newJob) {
        if (err) throw err
        job = newJob
        done()
      })
    })
  })
  it('should delete the job', function (done) {
    request.post('/api/jobs/delete')
    .send({
      jobIds: [job.attrs._id]
    })
    .set('Accept', 'application/json')
    .expect(200)
    .expect(function (res) {
      if (!res.body.deleted) throw new Error('Not deleted')
    })
    .end(function () {
      agenda._collection.count({}, null, function (err, res) {
        if (err) throw err
        if (res !== 0) throw new Error('Expected zero documents in database')
        done()
      })
    })
  })
})

describe('POST /api/jobs/requeue', function () {
  var job
  before(function (done) {
    agenda._collection.deleteMany({}, null, function (err, res) {
      if (err) throw err
      if (!res.result.ok) throw new Error('Did not clear test collection.')
      agenda.create('Test Job', {})
      .schedule('in 4 minutes')
      .save(function (err, newJob) {
        if (err) throw err
        job = newJob
        done()
      })
    })
  })
  it('should requeue the job', function (done) {
    request.post('/api/jobs/requeue')
    .send({
      jobIds: [job.attrs._id]
    })
    .set('Accept', 'application/json')
    .expect(200)
    .expect(function (res) {
      if (!res.body.newJobs) throw new Error('Did not return new job list')
      if (!res.body.newJobs.length !== 2) throw new Error('Did not return two jobs')
      done()
    })
    .end(function () {
      agenda._collection.count({}, null, function (err, res) {
        if (err) throw err
        if (res !== 2) throw new Error('Expected two documents in database')
        done()
      })
    })
  })
})
