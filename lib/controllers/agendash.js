'use strict';
const async = require('async');
const semver = require('semver');
const mongodb = require('mongodb');
module.exports = function(agenda, options) {
  options = options || {};

  agenda.on('ready', () => {
    const collection = agenda._collection.collection || agenda._collection;
    collection.createIndexes([
      {key: {nextRunAt: -1, lastRunAt: -1, lastFinishedAt: -1}},
      {key: {name: 1, nextRunAt: -1, lastRunAt: -1, lastFinishedAt: -1}}
    ], err => {
      if (err) {
      }
    });
    agenda._mdb.admin().serverInfo((err, serverInfo) => {
      if (err) {
        throw err;
      }
      if (!semver.satisfies(serverInfo.version, '>=2.6.0')) {
      }
    });
  });

  // options = {query = '', property = '', isObjectId = false, limit, skip}
  const getJobs = function(job, state, options){
    const preMatch = {};
    if (job) {
      preMatch.name = job;
    }

    if (options.query && options.property) {
      if (options.isObjectId) {
        preMatch[options.property] = mongodb.ObjectID.createFromHexString(options.query);
      } else {
        preMatch[options.property] = { '$regex': options.query, '$options': 'i' };
      }
    }

    const postMatch = {};
    if (state) {
      postMatch[state] = true;
    }

    const collection = agenda._collection.collection || agenda._collection;
    let result = collection.aggregate([
          {$match: preMatch},
          {$sort: {
            nextRunAt: -1,
            lastRunAt: -1,
            lastFinishedAt: -1
          }},
          {$project: {
            job: '$$ROOT',
            _id: '$$ROOT._id',
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
          {$facet: {
            pages: [
              {$count: "totalMatchs"},
              {$project: {
                totalPages: {$ceil: {$divide: ["$totalMatchs", options.limit]}}
              }}
            ],
            filtered: [
              {$skip: options.skip},
              {$limit: options.limit}
            ]
          }},
        ]).toArray()
        return result
  };

  const getOverview = () => {

    const collection = agenda._collection.collection || agenda._collection;
    return collection.aggregate([
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
        running: {$sum: {$cond: [{$and: ['$lastRunAt',{$gt: ['$lastRunAt', '$lastFinishedAt']}]}, 1, 0]}},
        scheduled: {$sum: {$cond: [{$and: ['$nextRunAt',{$gte: ['$nextRunAt', new Date()]}]}, 1, 0]}},
        queued: {$sum: {$cond: [{$and: ['$nextRunAt',{$gte: [new Date(), '$nextRunAt']},{$gte: ['$nextRunAt', '$lastFinishedAt']}]}, 1, 0]}},
        completed: {$sum: {$cond: [{$and: ['$lastFinishedAt',{$gt: ['$lastFinishedAt', '$failedAt']}]}, 1, 0]}},
        failed: {$sum: {$cond: [{$and: ['$lastFinishedAt','$failedAt',{$eq: ['$lastFinishedAt', '$failedAt']}]}, 1, 0]}},
        repeating: {$sum: {$cond: [{$and: ['$repeatInterval',{$ne: ['$repeatInterval', null]}]}, 1, 0]}}
      }}
    ]).toArray()
  };

  const api = function (job, state, {query: q, property, isObjectId, skip, limit}) {
    if (!agenda) {
      return Promise.reject('Agenda instance is not ready');
    }
    limit = parseInt(limit, 10) || 200;
    skip = parseInt(skip, 10) || 0;

    return new Promise( (resolve, reject) => {

    Promise.all([getOverview(), getJobs(job, state, {query: q, property, isObjectId, skip, limit})])
      .then( res => {
        const apiResponse = {
          overview: res[0],
          jobs: res[1][0].filtered,
          totalPages: res[1][0].pages[0].totalPages
        }
        apiResponse.title = options.title || 'Agendash';
        apiResponse.currentRequest = {
          title: options.title || 'Agendash',
          job: job || 'All Jobs',
          state
        }
         return resolve(apiResponse)
        })
        .catch( err => reject(err))

      })
  }


  const requeueJobs = (jobIds) => {
    if (!agenda) {
      return Promise.reject('Agenda instance is not ready');
    }
    return new Promise( (resolve, reject) => {

    const collection = agenda._collection.collection || agenda._collection;
    collection
      .find({_id: {$in: jobIds.map(jobId => collection.s.pkFactory(jobId))}})
      .toArray()
        .then( jobs => {
          if(!jobs.length){
            return reject('Job not found')
          }

          jobs.forEach( job => {
            let newJob = agenda.create(job.name, job.data)
            newJob.save()
              .catch( err => {
                return reject(err)
              })
            })

            return resolve('Jobs create successfully')
        })
        .catch( err => reject(err))

      })
  };

  const deleteJobs = (jobIds) => {
    if (!agenda) {
      return Promise.reject('Agenda instance is not ready');
    }

    const collection = agenda._collection.collection || agenda._collection;
    return agenda.cancel({_id: {$in: jobIds.map(jobId => collection.s.pkFactory(jobId))}})

  };

  const createJob = (jobName, jobSchedule, jobRepeatEvery, jobData) => {
    if (!agenda) {
      return Promise.reject('Agenda instance is not ready');
    }

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
      return Promise.reject('Jobs not created');
    }

    return job.save()

  };

  return {
    api,
    requeueJobs,
    deleteJobs,
    createJob
  };
};
