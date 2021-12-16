"use strict";
const semver = require("semver");
const { ObjectId } = require("mongodb"); // We rely on the Agenda's "mongodb", thus our package.json lists "*" as required version
const _ = require("lodash");
const humanInterval = require("human-interval");
const dayjs = require("dayjs");
const { isValidISODateString } = require('iso-datestring-validator');

module.exports = function (agenda, options) {
  options = options || {};

  agenda.on("ready", () => {
    const collection = agenda._collection.collection || agenda._collection;
    collection.createIndexes(
      [
        { key: { nextRunAt: -1, lastRunAt: -1, lastFinishedAt: -1 } },
        { key: { name: 1, nextRunAt: -1, lastRunAt: -1, lastFinishedAt: -1 } },
      ],
      (error) => {
        if (error) {
          // Ignoring for now
        }
      }
    );

    // Mongoose internals changed at some point. This will fix crash for older versions.
    const mdb = agenda._mdb.admin ? agenda._mdb : agenda._mdb.db;

    mdb.admin().serverInfo((error, serverInfo) => {
      if (error) {
        throw error;
      }

      if (!semver.satisfies(semver.coerce(serverInfo.version), ">=3.6.0")) {
        throw new Error("MongoDB version not supported");
      }
    });
  });

  // Options = {query = '', property = '', isObjectId = false, limit, skip}
  const getJobs = function (job, state, options) {
    const preMatch = {};
    if (job) {
      preMatch.name = job;
    }

    if (options.query && options.property) {
      if (options.isObjectId) {
        preMatch[options.property] = ObjectId(options.query);
      } else if (/^\d+$/.test(options.query)) {
        preMatch[options.property] = Number.parseInt(options.query, 10);
      } else {
        preMatch[options.property] = { $regex: options.query, $options: "i" };
      }
    }

    const postMatch = {};
    if (state) {
      postMatch[state] = true;
    }

    const collection = agenda._collection.collection || agenda._collection;
    return collection
      .aggregate([
        { $match: preMatch },
        {
          $sort: {
            nextRunAt: -1,
            lastRunAt: -1,
            lastFinishedAt: -1,
          },
        },
        {
          $project: {
            job: "$$ROOT",
            _id: "$$ROOT._id",
            running: {
              $and: ["$lastRunAt", { $gt: ["$lastRunAt", "$lastFinishedAt"] }],
            },
            scheduled: {
              $and: ["$nextRunAt", { $gte: ["$nextRunAt", new Date()] }],
            },
            queued: {
              $and: [
                "$nextRunAt",
                { $gte: [new Date(), "$nextRunAt"] },
                { $gte: ["$nextRunAt", "$lastFinishedAt"] },
              ],
            },
            completed: {
              $and: [
                "$lastFinishedAt",
                { $gt: ["$lastFinishedAt", "$failedAt"] },
              ],
            },
            failed: {
              $and: [
                "$lastFinishedAt",
                "$failedAt",
                { $eq: ["$lastFinishedAt", "$failedAt"] },
              ],
            },
            repeating: {
              $and: ["$repeatInterval", { $ne: ["$repeatInterval", null] }],
            },
          },
        },
        { $match: postMatch },
        {
          $facet: {
            pages: [
              { $count: "totalMatchs" },
              {
                $project: {
                  totalPages: {
                    $ceil: { $divide: ["$totalMatchs", options.limit] },
                  },
                },
              },
            ],
            filtered: [{ $skip: options.skip }, { $limit: options.limit }],
          },
        },
      ])
      .toArray();
  };

  const getOverview = async () => {
    const collection = agenda._collection.collection || agenda._collection;
    const results = await collection
      .aggregate([
        {
          $group: {
            _id: "$name",
            displayName: { $first: "$name" },
            meta: {
              $addToSet: {
                type: "$type",
                priority: "$priority",
                repeatInterval: "$repeatInterval",
                repeatTimezone: "$repeatTimezone",
              },
            },
            total: { $sum: 1 },
            running: {
              $sum: {
                $cond: [
                  {
                    $and: [
                      "$lastRunAt",
                      { $gt: ["$lastRunAt", "$lastFinishedAt"] },
                    ],
                  },
                  1,
                  0,
                ],
              },
            },
            scheduled: {
              $sum: {
                $cond: [
                  {
                    $and: ["$nextRunAt", { $gte: ["$nextRunAt", new Date()] }],
                  },
                  1,
                  0,
                ],
              },
            },
            queued: {
              $sum: {
                $cond: [
                  {
                    $and: [
                      "$nextRunAt",
                      { $gte: [new Date(), "$nextRunAt"] },
                      { $gte: ["$nextRunAt", "$lastFinishedAt"] },
                    ],
                  },
                  1,
                  0,
                ],
              },
            },
            completed: {
              $sum: {
                $cond: [
                  {
                    $and: [
                      "$lastFinishedAt",
                      { $gt: ["$lastFinishedAt", "$failedAt"] },
                    ],
                  },
                  1,
                  0,
                ],
              },
            },
            failed: {
              $sum: {
                $cond: [
                  {
                    $and: [
                      "$lastFinishedAt",
                      "$failedAt",
                      { $eq: ["$lastFinishedAt", "$failedAt"] },
                    ],
                  },
                  1,
                  0,
                ],
              },
            },
            repeating: {
              $sum: {
                $cond: [
                  {
                    $and: [
                      "$repeatInterval",
                      { $ne: ["$repeatInterval", null] },
                    ],
                  },
                  1,
                  0,
                ],
              },
            },
          },
        },
      ])
      .toArray();
    const states = {
      total: 0,
      running: 0,
      scheduled: 0,
      queued: 0,
      completed: 0,
      failed: 0,
      repeating: 0,
    };
    const totals = { displayName: "All Jobs", ...states };

    for (const job of results) {
      for (const state of Object.keys(states)) {
        totals[state] += job[state];
      }
    }

    results.unshift(totals);
    return results;
  };

  const api = async function (
    job,
    state,
    { query: q, property, isObjectId, skip, limit }
  ) {
    if (!agenda) {
      return Promise.reject(new Error("Agenda instance is not ready"));
    }

    limit = Number.parseInt(limit, 10) || 200;
    skip = Number.parseInt(skip, 10) || 0;

    const [overview, jobs] = await Promise.all([
      getOverview(),
      getJobs(job, state, { query: q, property, isObjectId, skip, limit }),
    ]);
    const apiResponse = {
      overview,
      jobs: jobs[0].filtered,
      totalPages: jobs[0].pages[0] ? jobs[0].pages[0].totalPages : 0,
    };
    apiResponse.title = options.title || "Agendash";
    apiResponse.currentRequest = {
      title: options.title || "Agendash",
      job: job || "All Jobs",
      state,
    };
    return apiResponse;
  };

  const requeueJobs = async (jobIds) => {
    if (!agenda) {
      return Promise.reject(new Error("Agenda instance is not ready"));
    }

    const collection = agenda._collection.collection || agenda._collection;
    const jobs = await collection
      .find({
        _id: { $in: jobIds.map((jobId) => ObjectId(jobId)) },
      })
      .toArray();
    if (jobs.length === 0) {
      throw new Error("Job not found");
    }

    for (const job of jobs) {
      const newJob = agenda.create(job.name, job.data);
      // eslint-disable-next-line no-await-in-loop
      await newJob.save();
    }

    return "Jobs create successfully";
  };

  const deleteJobs = (jobIds) => {
    if (!agenda) {
      return Promise.reject(new Error("Agenda instance is not ready"));
    }

    return agenda.cancel({
      _id: { $in: jobIds.map((jobId) => ObjectId(jobId)) },
    });
  };

  const createJob = (jobName, jobSchedule, jobRepeatEvery, jobData) => {
    if (!agenda) {
      return Promise.reject(new Error("Agenda instance is not ready"));
    }

    // validate input args ...

    // jobName is a mandatory argument
    if (!jobName || !_.isString(jobName)) {
      return Promise.reject(new Error("jobName must be a non-empty string"));
    }

    /*
    in the TS definitions, jobData extends the following interface, implying this
    should be a POJSO:

      export interface JobAttributesData {
       [key: string]: any;
      }
    */
    if (jobData && !_.isPlainObject(jobData)) {
      return Promise.reject(new Error("jobData must be a valid JSON object"));
    }

    // validation for jobRepeatEvery is complicated since it can be a cron or humanized string, so skip it ...

    let _jobSchedule = undefined;
    if (jobSchedule) {
      // first, check if it's a human interval
      const interval = humanInterval(jobSchedule);
      if (!_.isNaN(interval)) {
        _jobSchedule = dayjs().add(interval, 'ms').toDate();
      } else {
        // then check if this is a valid ISO 8601 string
        if (isValidISODateString(jobSchedule)) {
          _jobSchedule = dayjs(jobSchedule).toDate();
        }
      }

      // if we haven't managed to parse the string yet, fail
      if (!_jobSchedule) {
        return Promise.reject(new Error("jobSchedule must either be a valid human interval or ISO 8601 string"));
      }
    }

    const job = agenda.create(jobName, jobData);
    if (_jobSchedule && jobRepeatEvery) {
      job.repeatAt(_jobSchedule);
      job.repeatEvery(jobRepeatEvery);
    } else if (_jobSchedule) {
      job.schedule(_jobSchedule);
    } else if (jobRepeatEvery) {
      job.repeatEvery(jobRepeatEvery);
    } else {
      // if no jobSchedule or jobRepeatEvery is provided, assume user wants to run the job once, now
      job.schedule(new Date());
    }

    return job.save();
  };

  return {
    api,
    requeueJobs,
    deleteJobs,
    createJob,
  };
};
