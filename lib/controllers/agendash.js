"use strict";
// const semver = require("semver");
const { ObjectId } = require("mongodb"); // We rely on the Agenda's "mongodb", thus our package.json lists "*" as required version

module.exports = function (agenda, options) {
  options = options || {};

  // Options = {query = '', property = '', isObjectId = false, limit, skip}
  const getJobs =  async function (jobName, state, options) {
    // Build the query
    const query = {};
    if (jobName) {
      query.name = jobName;
    }

    if (options.query && options.property) {
      if (options.isObjectId) {
        query[options.property] = { '=': options.query };
      } else if (/^\d+$/.test(options.query)) {
        query[options.property] = { '=': Number.parseInt(options.query, 10) };
      } else {
        // TODO: Update this
        query[options.property] = { 'LIKE': options.query };
      }
    }

    if (state) {
      query[state] = true;
    }
    // Get the jobs
    const jobs = await agenda.db.getJobs(
      query,
      {
        repeatInterval: -1,
        nextRunAt: -1,
        lastRunAt: -1,
        lastFinishedAt: -1,
      },
      options.limit,
      options.skip
    );

    // Process the jobs
    const filteredJobs = jobs.filter(job => {
      if (state === 'running') return job.lastRunAt && job.lastRunAt > job.lastFinishedAt;
      if (state === 'scheduled') return job.nextRunAt && job.nextRunAt >= new Date();
      if (state === 'queued') return job.nextRunAt && new Date() >= job.nextRunAt && job.nextRunAt >= job.lastFinishedAt;
      if (state === 'completed') return job.lastFinishedAt && job.lastFinishedAt > job.failedAt;
      if (state === 'failed') return job.lastFinishedAt && job.failedAt && job.lastFinishedAt === job.failedAt;
      if (state === 'repeating') return job.repeatInterval && job.repeatInterval !== null;
      return true;
    });

    let jobsWithComputedProps = filteredJobs.map(job => ({
      ...job,
      running: job.lastRunAt && job.lastRunAt > job.lastFinishedAt,
      scheduled: job.nextRunAt && job.nextRunAt >= new Date(),
      queued: job.nextRunAt && new Date() >= job.nextRunAt && job.nextRunAt >= job.lastFinishedAt,
      completed: job.lastFinishedAt && job.lastFinishedAt > job.failedAt,
      failed: job.lastFinishedAt && job.failedAt && job.lastFinishedAt.getTime() === job.failedAt.getTime(),
      repeating: job.repeatInterval != null
    }));

    if(jobName){
      // Attach all the execution logs to the jobs that are scheduled
      jobsWithComputedProps.filter(job => job.repeating).map(async (job) => {
        let executionLogs = await agenda.db.getJobExecutionLog(job._id || job.id);
        executionLogs.map(log => {
          jobsWithComputedProps.push( {
            completed: !log.error,
            failed: !!log.error,
            name: job.name,
            lastRunAt: log.runAt,
            nextRunAt: null,
            lastFinishedAt: log.finishedAt
          });
        })
      });
    }
    

    // Get total count for pagination
    const totalCount = await agenda.db.getJobs(query);
    const totalPages = Math.ceil(totalCount.length / options.limit);

    return {
      pages: [{ totalPages }],
      filtered: jobsWithComputedProps,
    };
  };

  const getOverview = async () => {
    return await agenda.db.getOverview();
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
      jobs: jobs.filtered,
      totalPages: jobs.pages[0] ? jobs.pages[0].totalPages : 0,
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

    const jobs = await agenda.db.getJobs({ _id: { 'IN': jobIds.map((jobId) => {
      try {
        return new ObjectId(jobId);
      } catch (error) {
        return jobId;
      }
    }) }})
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

  const deleteJobs = async (jobIds) => {
    if (!agenda) {
      return new Error("Agenda instance is not ready");
    }

    return await agenda.cancel({
      _id: { 'IN': jobIds.map((jobId) => {
        try {
          return new ObjectId(jobId);
        } catch (error) {
          return jobId;
        }
      }) },
    });
  };

  const createJob = (jobName, jobSchedule, jobRepeatEvery, jobData) => {
    if (!agenda) {
      return Promise.reject(new Error("Agenda instance is not ready"));
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
      return Promise.reject(new Error("Jobs not created"));
    }

    return job.save();
  };

  const getJobExecutionLogs = async (jobId) => {  
    if (!agenda) {
      return Promise.reject(new Error("Agenda instance is not ready"));
    }

    return await agenda.db.getJobExecutionLog(jobId);
  };

  return {
    api,
    requeueJobs,
    deleteJobs,
    createJob,
    getJobExecutionLogs
  };
};
