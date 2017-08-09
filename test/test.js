/* global describe, it, before */
'use strict';
const supertest = require('supertest');
const express = require('express');
const Agenda = require('agenda');

const agenda = new Agenda().database('mongodb://127.0.0.1/agendash-test-db', 'agendash-test-collection');

const app = express();
app.use('/', require('../app')(agenda));

const request = supertest(app);

before(done => {
  agenda.on('ready', err => {
    if (err) {
      return done(err);
    }
    done(err);
  });
});

describe('GET /api with no jobs', () => {
  before(done => {
    agenda._collection.deleteMany({}, null, (err, res) => {
      if (err) {
        return done(err);
      }
      if (!res.result.ok) {
        throw new Error('Did not clear test collection.');
      }
      done();
    });
  });
  it('should return the correct overview', done => {
    request.get('/api')
    .expect(200)
    .expect(res => {
      if (!res.body.overview) {
        throw new Error('No overview');
      }
      if (res.body.overview[0].displayName !== 'All Jobs') {
        throw new Error('Does not show All Jobs');
      }
      if (res.body.jobs.length !== 0) {
        throw new Error('Jobs array is not empty');
      }
    })
    .end(done);
  });
});

describe('POST /api/jobs/create', () => {
  before(done => {
    agenda._collection.deleteMany({}, null, (err, res) => {
      if (err) {
        return done(err);
      }
      if (!res.result.ok) {
        throw new Error('Did not clear test collection.');
      }
      done();
    });
  });
  it('should confirm the job exists', done => {
    request.post('/api/jobs/create')
    .send({
      jobName: 'Test Job',
      jobSchedule: 'in 2 minutes',
      jobRepeatEvery: '',
      jobData: {}
    })
    .set('Accept', 'application/json')
    .expect(200)
    .expect(res => {
      if (!res.body.created) {
        throw new Error('Not created');
      }
    })
    .end(() => {
      agenda._collection.count({}, null, (err, res) => {
        if (err) {
          return done(err);
        }
        if (res !== 1) {
          throw new Error('Expected one document in database');
        }
        done();
      });
    });
  });
});

describe('POST /api/jobs/delete', () => {
  let job;
  before(done => {
    agenda._collection.deleteMany({}, null, (err, res) => {
      if (err) {
        return done(err);
      }
      if (!res.result.ok) {
        throw new Error('Did not clear test collection.');
      }
      agenda.create('Test Job', {})
      .schedule('in 4 minutes')
      .save((err, newJob) => {
        if (err) {
          return done(err);
        }
        job = newJob;
        done();
      });
    });
  });
  it('should delete the job', done => {
    request.post('/api/jobs/delete')
    .send({
      jobIds: [job.attrs._id]
    })
    .set('Accept', 'application/json')
    .expect(200)
    .expect(res => {
      if (!res.body.deleted) {
        throw new Error('Not deleted');
      }
    })
    .end(() => {
      agenda._collection.count({}, null, (err, res) => {
        if (err) {
          return done(err);
        }
        if (res !== 0) {
          throw new Error('Expected zero documents in database');
        }
        done();
      });
    });
  });
});

describe('POST /api/jobs/requeue', () => {
  let job;
  before(done => {
    agenda._collection.deleteMany({}, null, (err, res) => {
      if (err) {
        return done(err);
      }
      if (!res.result.ok) {
        throw new Error('Did not clear test collection.');
      }
      agenda.create('Test Job', {})
      .schedule('in 4 minutes')
      .save((err, newJob) => {
        if (err) {
          return done(err);
        }
        job = newJob;
        done();
      });
    });
  });
  it('should requeue the job', done => {
    request.post('/api/jobs/requeue')
    .send({
      jobIds: [job.attrs._id]
    })
    .set('Accept', 'application/json')
    .expect(200)
    .expect(res => {
      if (!res.body.newJobs) {
        throw new Error('Did not return new job list');
      }
      if (!res.body.newJobs.length !== 2) {
        throw new Error('Did not return two jobs');
      }
      done();
    })
    .end(() => {
      agenda._collection.count({}, null, (err, res) => {
        if (err) {
          return done(err);
        }
        if (res !== 2) {
          throw new Error('Expected two documents in database');
        }
        done();
      });
    });
  });
});
