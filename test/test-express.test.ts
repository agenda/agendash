import Agenda from '@sealos/agenda';
import express from 'express';
import supertest from 'supertest';

import { MongoMemoryServer } from 'mongodb-memory-server';
import Agendash from '../lib/app';

function assertEquals<T>(value1: T, value2: T, message?: string) {
  if (value1 !== value2) {
    throw new Error(message);
  }
}

describe('Agenda', () => {
  let agenda: Agenda;
  let mongoServer: MongoMemoryServer;

  const expressApp = express();

  const request = supertest(expressApp);

  before(async () => {
    mongoServer = await MongoMemoryServer.create({});

    agenda = new Agenda({
      db: {
        address: mongoServer.getUri(),
        collection: 'agendash-test-collection',
      },
    });

    expressApp.use("/", Agendash(agenda));
  });

  beforeEach(async () => {
    await agenda._collection?.deleteMany({});
  });

  after(async () => {
    await agenda.stop();
    await mongoServer.stop();
  });

  it(
    'GET /api with no jobs should return the correct overview',
    async () => {
      const response = await request.get('/api?limit=200&skip=0');

      assertEquals(response.body.overview[0].displayName, 'All Jobs');
      assertEquals(response.body.jobs.length, 0);
    },
  );

  it(
    'POST /api/jobs/create should confirm the job exists',
    async () => {
      const response = await request
        .post('/api/jobs/create')
        .send({
          jobName: 'Test Job',
          jobSchedule: 'in 2 minutes',
          jobRepeatEvery: '',
          jobData: {},
        })
        .set('Accept', 'application/json');

      assertEquals('created' in response.body, true);

      const count = await agenda._collection.count({});
      assertEquals(count, 1);
    },
  );

  it('POST /api/jobs/delete should delete the job', async () => {
    const job = await agenda
      .create('Test Job', {})
      .schedule('in 4 minutes')
      .save();

    const response = await request
      .post('/api/jobs/delete')
      .send({
        jobIds: [job.attrs._id],
      })
      .set('Accept', 'application/json');

    assertEquals('deleted' in response.body, true);

    const count = await agenda._collection.count({});
    assertEquals(count, 0);
  });

  it('POST /api/jobs/requeue should requeue the job', async () => {
    const job = await agenda
      .create('Test Job', {})
      .schedule('in 4 minutes')
      .save();

    const response = await request
      .post('/api/jobs/requeue')
      .send({
        jobIds: [job.attrs._id],
      })
      .set('Accept', 'application/json');

    assertEquals('newJobs' in response.body, false);

    const count = await agenda._collection.count({});
    assertEquals(count, 2);
  });
});
