'use strict';

const path = require('path');
const pack = require('../../package.json');

module.exports = agendash => {
  return {
    pkg: pack,
    register: async (server, options) => {
      server.route([
        {
          method: 'GET',
          path: '/{param*}',
          handler: {
            directory: {
              path: path.join(__dirname, '../../public')
            }
          },
          config: {
            auth: options.auth || false
          }
        },
        {
          method: 'GET',
          path: '/api',
          handler: async (request, h) => {
            try {
              const apiResponse = await new Promise((resolve, reject) => {
                agendash.api(request.query.job, request.query.state, (err, apiResponse) => {
                  if (err) {
                    return reject(err);
                  }
                  resolve(apiResponse);
                });
              });
              return h.response(apiResponse);
            } catch (err) {
              return h.response(err).code(400);
            }
          },
          config: {
            auth: options.auth || false
          }
        },
        {
          method: 'POST',
          path: '/api/jobs/requeue',
          handler: async (request, h) => {
            try {
              const requeueJobs = await new Promise((resolve, reject) => {
                agendash.requeueJobs(request.payload.jobIds, (err, requeueJobs) => {
                  if (err) {
                    return reject(err);
                  }
                  resolve(requeueJobs);
                });
              });
              return h.response(requeueJobs);
            } catch (err) {
              return h.response(err).code(404);
            }
          },
          config: {
            auth: options.auth || false
          }
        },
        {
          method: 'POST',
          path: '/api/jobs/delete',
          handler: async (request, h) => {
            try {
              const deletedJobs = await new Promise((resolve, reject) => {
                agendash.deleteJobs(request.payload.jobIds, err => {
                  if (err) {
                    return reject(err);
                  }
                  resolve({
                    deleted: true
                  });
                });
              });
              return h.response(deletedJobs);
            } catch (err) {
              return h.response(err).code(404);
            }
          },
          config: {
            auth: options.auth || false
          }
        },
        {
          method: 'POST',
          path: '/api/jobs/create',
          handler: async (request, h) => {
            try {
              const createdJobs = await new Promise((resolve, reject) => {
                agendash.createJob(request.payload.jobName, request.payload.jobSchedule, request.payload.jobRepeatEvery, request.payload.jobData, err => {
                  if (err) {
                    return reject(err);
                  }
                  resolve({
                    created: true
                  });
                });
              });
              return h.response(createdJobs);
            } catch (err) {
              return h.response(err).code(404);
            }
          },
          config: {
            auth: options.auth || false
          }
        }
      ]);
    }
  };
};
