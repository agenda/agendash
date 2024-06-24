import path from 'path';
import express, { Router } from 'express';
import bodyParser from 'body-parser';

import { AgendashController } from './controllers/agendash';
import { Agenda } from '@sealos/agenda';

const CSP = {
  "default-src": [
    "'self'",
  ],
  "script-src": [
    "https://code.jquery.com",
    "https://cdn.jsdelivr.net",
    "https://cdnjs.cloudflare.com",
    "https://stackpath.bootstrapcdn.com",
    "'unsafe-inline'",
    "'unsafe-eval'",
    "'self'",
  ],
  "style-src": [
    "https://cdn.jsdelivr.net",
    "https://stackpath.bootstrapcdn.com",
    "https://fonts.googleapis.com",
    "https://unpkg.com",
    "'self'",
  ],
  "font-src": [
    "https://fonts.gstatic.com",
  ],
};

const csp = Object.entries(CSP)
  .map(([type, values]) => `${type} ${values.join(" ")}`)
  .join("; ")

function expressMiddleware(agendash: AgendashController) {
  const expressApp = express();
  expressApp.use(bodyParser.json());
  expressApp.use(bodyParser.urlencoded({ extended: false }));

  expressApp.use((req, res, next) => {
    res.header('Content-Security-Policy', csp);
    next();
  });

  expressApp.use('/', express.static(path.join(__dirname, '../public')));

  expressApp.get('/api', async (request, response) => {
    try {
      const {
        job,
        state,
        skip,
        limit,
        q,
        property,
        isObjectId,
      } = request.query as {
        job: string;
        state: string;
        skip: string;
        limit: string;
        q: string;
        property: string;
        isObjectId: string;
      };
      const apiResponse = await agendash.api(job, state, {
        query: q,
        property,
        isObjectId,
        skip,
        limit,
      });
      response.json(apiResponse);
    } catch (error) {
      response.status(400).json(error);
    }
  });

  expressApp.post('/api/jobs/requeue', async (request, response) => {
    try {
      const newJobs = await agendash.requeueJobs(request.body.jobIds);
      response.send(newJobs);
    } catch (error) {
      response.status(404).json(error);
    }
  });

  expressApp.post('/api/jobs/delete', async (request, response) => {
    try {
      const body = request.body as { jobIds: string[] };
      const deleted = await agendash.deleteJobs(body.jobIds);
      if (deleted) {
        response.json({ deleted: true });
      } else {
        response.json({ message: 'Jobs not deleted' });
      }
    } catch (error) {
      response.status(404).json(error);
    }
  });

  expressApp.post('/api/jobs/create', async (request, response) => {
    try {
      const body = request.body as {
        jobName: string;
        jobSchedule: string;
        jobRepeatEvery: string;
        jobData: any;
      };
      await agendash.createJob(
        body.jobName,
        body.jobSchedule,
        body.jobRepeatEvery,
        body.jobData,
      );
      response.json({ created: true });
    } catch (error) {
      response.status(400).json(error);
    }
  });

  return expressApp;
}

export default function Agendash(agenda: Agenda) {
  const agendash = new AgendashController(agenda);

  return expressMiddleware(agendash);
}
