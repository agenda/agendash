'use strict';
const async = require('async');
const semver = require('semver');

module.exports = function(agenda, options) {
  options = options || {};

  agenda.on('ready', () => {
    const collection = agenda._collection.collection || agenda._collection;
    collection.createIndexes([
      {key: {nextRunAt: -1, lastRunAt: -1, lastFinishedAt: -1}},
      {key: {name: 1, nextRunAt: -1, lastRunAt: -1, lastFinishedAt: -1}}
    ], err => {
      if (err) {
        console.warn('Agendash indexes might not exist. Performance may decrease.');
      }
    });
    agenda._mdb.admin().serverInfo((err, serverInfo) => {
      if (err) {
        throw err;
      }
      if (!semver.satisfies(serverInfo.version, '>=2.6.0')) {
        console.warn('Agendash requires mongodb version >=2.6.0.');
      }
    });
  });

  const getJobs = (job, state, callback) => {
    const preMatch = {};
    if (job) {
      preMatch.name = job;
    }

    const postMatch = {};
    if (state) {
      postMatch[state] = true;
    }

    const limit = 200; // @TODO: UI param
    const skip = 0; // @TODO: UI param

    const collection = agenda._collection.collection || agenda._collection;
    collection.aggregate([
      {$match: preMatch},
      {$sort: {
        nextRunAt: -1,
        lastRunAt: -1,
        lastFinishedAt: -1
      }},
      {$project: {
        _id: 0,
        job: '$$ROOT',
        nextRunAt: {$ifNull: ['$nextRunAt', 0]},
        lockedAt: {$ifNull: ['$lockedAt', 0]},
        lastRunAt: {$ifNull: ['$lastRunAt', 0]},
        lastFinishedAt: {$ifNull: ['$lastFinishedAt', 0]},
        failedAt: {$ifNull: ['$failedAt', 0]},
        repeatInterval: {$ifNull: ['$repeatInterval', 0]}
      }},
      {$project: {
        job: '$job',
        _id: '$job._id',
        running: {$and: [
          '$lastRunAt',
          {$gt: ['$lastRunAt', '$lastFinishedAt']}
        ]},
        scheduled: {$and: [
          '$nextRunAt',
          {$gte: ['$nextRunAt', new Date()]}
        ]},
        queued: {$and: [
          '$nextRunAt',
          {$gte: [new Date(), '$nextRunAt']},
          {$gte: ['$nextRunAt', '$lastFinishedAt']}
        ]},
        completed: {$and: [
          '$lastFinishedAt',
          {$gt: ['$lastFinishedAt', '$failedAt']}
        ]},
        failed: {$and: [
          '$lastFinishedAt',
          '$failedAt',
          {$eq: ['$lastFinishedAt', '$failedAt']}
        ]},
        repeating: {$and: [
          '$repeatInterval',
          {$ne: ['$repeatInterval', null]}
        ]}
      }},
      {$match: postMatch},
      {$limit: limit},
      {$skip: skip}
    ]).toArray((err, results) => {
      if (err) {
        return callback(err);
      }
      callback(null, results);
    });
  };

  const getOverview = callback => {
    const collection = agenda._collection.collection || agenda._collection;
    collection.aggregate([
      {$project: {
        _id: 0,
        name: '$name',
        type: '$type',
        priority: '$priority',
        repeatInterval: '$repeatInterval',
        repeatTimezone: '$repeatTimezone',
        nextRunAt: {$ifNull: ['$nextRunAt', 0]},
        lockedAt: {$ifNull: ['$lockedAt', 0]},
        lastRunAt: {$ifNull: ['$lastRunAt', 0]},
        lastFinishedAt: {$ifNull: ['$lastFinishedAt', 0]},
        failedAt: {$ifNull: ['$failedAt', 0]}
      }},
      {$project: {
        name: '$name',
        type: '$type',
        priority: '$priority',
        repeatInterval: '$repeatInterval',
        repeatTimezone: '$repeatTimezone',
        running: {$cond: [{$and: [
          '$lastRunAt',
          {$gt: ['$lastRunAt', '$lastFinishedAt']}
        ]}, 1, 0]},
        scheduled: {$cond: [{$and: [
          '$nextRunAt',
          {$gte: ['$nextRunAt', new Date()]}
        ]}, 1, 0]},
        queued: {$cond: [{$and: [
          '$nextRunAt',
          {$gte: [new Date(), '$nextRunAt']},
          {$gte: ['$nextRunAt', '$lastFinishedAt']}
        ]}, 1, 0]},
        completed: {$cond: [{$and: [
          '$lastFinishedAt',
          {$gt: ['$lastFinishedAt', '$failedAt']}
        ]}, 1, 0]},
        failed: {$cond: [{$and: [
          '$lastFinishedAt',
          '$failedAt',
          {$eq: ['$lastFinishedAt', '$failedAt']}
        ]}, 1, 0]},
        repeating: {$cond: [{$and: [
          '$repeatInterval',
          {$ne: ['$repeatInterval', null]}
        ]}, 1, 0]}
      }},
      {$group: {
        _id: '$name',
        displayName: {$first: '$name'},
        meta: {$addToSet: {
          type: '$type',
          priority: '$priority',
          repeatInterval: '$repeatInterval',
          repeatTimezone: '$repeatTimezone'
        }},
        total: {$sum: 1},
        running: {$sum: '$running'},
        scheduled: {$sum: '$scheduled'},
        queued: {$sum: '$queued'},
        completed: {$sum: '$completed'},
        failed: {$sum: '$failed'},
        repeating: {$sum: '$repeating'}
      }}
    ]).toArray((err, results) => {
      if (err) {
        return callback(err);
      }
      const totals = {displayName: 'All Jobs'};
      const states = ['total', 'running', 'scheduled', 'queued', 'completed', 'failed', 'repeating'];
      states.forEach(state => {
        totals[state] = 0;
      });
      results.forEach(job => {
        states.forEach(state => {
          totals[state] += job[state];
        });
      });
      results.unshift(totals);
      callback(null, results);
    });
  };

  const api = function(job, state, callback) {
    if (!agenda) {
      return callback('Agenda instance is not ready');
    }
    async.parallel({
      overview: getOverview,
      jobs: getJobs.bind(this, job, state)
    },
    (err, apiResponse) => {
      if (err) {
        return callback(err.message);
      }
      apiResponse.title = options.title || 'Agendash';
      apiResponse.currentRequest = {
        title: options.title || 'Agendash',
        job: job || 'All Jobs',
        state
      };
      callback(null, apiResponse);
    });
  };

  const requeueJobs = (jobIds, callback) => {
    if (!agenda) {
      return callback('Agenda instance is not ready');
    }
    try {
      const collection = agenda._collection.collection || agenda._collection;
      collection
      .find({_id: {$in: jobIds.map(jobId => collection.s.pkFactory(jobId))}})
      .toArray((err, jobs) => {
        if (err || jobs.length === 0) {
          return callback('Jobs not found');
        }
        async.series(jobs.map(job => done => {
          const newJob = agenda.create(job.name, job.data);
          newJob.save()
          .then(() => {
            done(null, newJob);
          })
          .catch(err => {
            done(err);
          });
        }), (err, results) => {
          callback(err, results);
        });
      });
    } catch (err) {
      callback(err.message);
    }
  };

  const deleteJobs = (jobIds, callback) => {
    if (!agenda) {
      return callback('Agenda instance is not ready');
    }
    try {
      const collection = agenda._collection.collection || agenda._collection;
      agenda.cancel({_id: {$in: jobIds.map(jobId => collection.s.pkFactory(jobId))}})
        .then(deleted => {
          if (deleted) {
            callback();
          } else {
            callback('Jobs not deleted');
          }
        })
        .catch(err => {
          callback(err);
        });
    } catch (err) {
      callback(err.message);
    }
  };

  const createJob = (jobName, jobSchedule, jobRepeatEvery, jobData, callback) => {
    if (!agenda) {
      return callback('Agenda instance is not ready');
    }
    try {
      // @TODO: Need to validate user input.
      const job = agenda.create(jobName, jobData);
      if (jobSchedule && jobRepeatEvery) {
        job.repeatAt(jobSchedule);
        job.repeatEvery(jobRepeatEvery);
      } else if (jobSchedule) {
        job.schedule(jobSchedule);
      } else if (jobRepeatEvery) {
        job.repeatEvery(jobRepeatEvery);
      } else {
        return callback('Jobs not created');
      }
      job.save()
        .then(() => {
          callback();
        })
        .catch(() => {
          return callback('Jobs not created');
        });
    } catch (err) {
      callback(err.message);
    }
  };

  return {
    api,
    requeueJobs,
    deleteJobs,
    createJob
  };
};
