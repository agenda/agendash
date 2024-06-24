import { Document, ObjectId } from 'mongodb';
import { Agenda, JobAttributesData } from '@sealos/agenda'; // We rely on the Agenda's "mongodb", thus our package.json lists "*" as required version

export class AgendashController {

  constructor(private readonly agenda: Agenda) {
    agenda.on('ready', () => {

      const collection = agenda._collection;
      collection.createIndexes(
        [
          { key: { nextRunAt: -1, lastRunAt: -1, lastFinishedAt: -1 } },
          { key: { name: 1, nextRunAt: -1, lastRunAt: -1, lastFinishedAt: -1 } },
        ],
        // @ts-expect-error
        (error) => {
          if (error) {
            // Ignoring for now
          }
        },
      ).then(() => {
        // Ignoring for now
      });
    });
  }

  getJobs = (job: string, state: string, options: {
    query: string,
    property: string,
    isObjectId: boolean,
    limit: number,
    skip: number
  }) => {
    const preMatch: Document = {};
    if (job) {
      preMatch.name = job;
    }

    if (options.query && options.property) {
      if (options.isObjectId) {
        preMatch[options.property] = new ObjectId(options.query);
      } else if (/^\d+$/.test(options.query)) {
        preMatch[options.property] = Number.parseInt(options.query, 10);
      } else {
        preMatch[options.property] = { $regex: options.query, $options: 'i' };
      }
    }

    const postMatch = {};
    if (state) {
      postMatch[state] = true;
    }

    const collection = this.agenda._collection;
    return collection
      .aggregate([
        { $match: preMatch },
        {
          $sort: {
            repeatInterval: -1,
            nextRunAt: -1,
            lastRunAt: -1,
            lastFinishedAt: -1,
          },
        },
        {
          $project: {
            job: '$$ROOT',
            _id: '$$ROOT._id',
            running: {
              $and: ['$lastRunAt', { $gt: ['$lastRunAt', '$lastFinishedAt'] }],
            },
            scheduled: {
              $and: ['$nextRunAt', { $gte: ['$nextRunAt', new Date()] }],
            },
            queued: {
              $and: [
                '$nextRunAt',
                { $gte: [new Date(), '$nextRunAt'] },
                { $gte: ['$nextRunAt', '$lastFinishedAt'] },
              ],
            },
            completed: {
              $and: [
                '$lastFinishedAt',
                { $gt: ['$lastFinishedAt', '$failedAt'] },
              ],
            },
            failed: {
              $and: [
                '$lastFinishedAt',
                '$failedAt',
                { $eq: ['$lastFinishedAt', '$failedAt'] },
              ],
            },
            repeating: {
              $and: ['$repeatInterval', { $ne: ['$repeatInterval', null] }],
            },
          },
        },
        { $match: postMatch },
        {
          $facet: {
            pages: [
              { $count: 'totalMatchs' },
              {
                $project: {
                  totalPages: {
                    $ceil: { $divide: ['$totalMatchs', options.limit] },
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

  getOverview = async () => {
    const collection = this.agenda._collection;
    const results = await collection
      .aggregate([
        {
          $group: {
            _id: '$name',
            displayName: { $first: '$name' },
            meta: {
              $addToSet: {
                type: '$type',
                priority: '$priority',
                repeatInterval: '$repeatInterval',
                repeatTimezone: '$repeatTimezone',
              },
            },
            total: { $sum: 1 },
            running: {
              $sum: {
                $cond: [
                  {
                    $and: [
                      '$lastRunAt',
                      { $gt: ['$lastRunAt', '$lastFinishedAt'] },
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
                    $and: ['$nextRunAt', { $gte: ['$nextRunAt', new Date()] }],
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
                      '$nextRunAt',
                      { $gte: [new Date(), '$nextRunAt'] },
                      { $gte: ['$nextRunAt', '$lastFinishedAt'] },
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
                      '$lastFinishedAt',
                      { $gt: ['$lastFinishedAt', '$failedAt'] },
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
                      '$lastFinishedAt',
                      '$failedAt',
                      { $eq: ['$lastFinishedAt', '$failedAt'] },
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
                      '$repeatInterval',
                      { $ne: ['$repeatInterval', null] },
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
    const totals = { displayName: 'All Jobs', ...states };

    for (const job of results) {
      for (const state of Object.keys(states)) {
        totals[state] += job[state];
      }
    }

    results.unshift(totals);
    return results;
  };

  api = async (
    job: string,
    state,
    { query: q, property, isObjectId, skip, limit },
  ) => {

    limit = Number.parseInt(limit, 10) || 200;
    skip = Number.parseInt(skip, 10) || 0;

    const [overview, jobs] = await Promise.all([
      this.getOverview(),
      this.getJobs(job, state, { query: q, property, isObjectId, skip, limit }),
    ]);
    return {
      overview,
      jobs: jobs[0].filtered,
      totalPages: jobs[0].pages[0] ? jobs[0].pages[0].totalPages : 0,
      title: 'Agendash',
      currentRequest: {
        title: 'Agendash',
        job: job || 'All Jobs',
        state,
      },
    };
  };

  requeueJobs = async (jobIds) => {
    const collection = this.agenda._collection;
    const jobs = await collection
      .find({
        _id: { $in: jobIds.map((jobId) => new ObjectId(jobId)) },
      })
      .toArray();
    if (jobs.length === 0) {
      throw new Error('Job not found');
    }

    for (const job of jobs) {
      const newJob = this.agenda.create(job.name, job.data);
      // eslint-disable-next-line no-await-in-loop
      await newJob.save();
    }

    return 'Jobs create successfully';
  };

  deleteJobs = (jobIds) => {
    return this.agenda.cancel({
      _id: { $in: jobIds.map((jobId) => new ObjectId(jobId)) },
    });
  };

  createJob = <T extends JobAttributesData>(jobName: string, jobSchedule: string, jobRepeatEvery: string, jobData: T) => {
    // @TODO: Need to validate user input.
    const job = this.agenda.create(jobName, jobData);
    if (jobSchedule && jobRepeatEvery) {
      job.repeatAt(jobSchedule);
      job.repeatEvery(jobRepeatEvery);
    } else if (jobSchedule) {
      job.schedule(jobSchedule);
    } else if (jobRepeatEvery) {
      job.repeatEvery(jobRepeatEvery);
    } else {
      return Promise.reject(new Error('Jobs not created'));
    }

    return job.save();
  };
}
