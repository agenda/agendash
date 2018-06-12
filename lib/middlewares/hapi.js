'use strict';
const pkg = require('../../package.json');
const Path = require('path');

module.exports = (agendash) => {

  return {
    pkg: pkg,
    register: async function (server, options) {

      server.route([{
          method: 'GET',
          path: '/{param*}',
          handler: {
            directory: {
              path: Path.join(__dirname, '../../public')
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
              const apiResponse = await new Promise(function(resolve,reject){
                agendash.api(request.query.job, request.query.state, (err, apiResponse) => {
                  if (err) {
                    return reject(err);
                  }
                  resolve(apiResponse);
                });
              });
              return h.response(apiResponse);
            } catch (error) {      
              return h.response(error).code(400);
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
              const requeueJobs = await new Promise(function(resolve,reject){
                agendash.requeueJobs(request.payload.jobIds, (err, requeueJobs) => {
                  if (err) {
                    return reject(err);
                  }
                  resolve(requeueJobs);
                });
              });
              return h.response(requeueJobs);
            } catch (error) {        
              return h.response(error).code(404);
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
              const deletedJobs = await new Promise(function(resolve,reject){
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
            } catch (error) {        
              return h.response(error).code(404);
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
            const createdJobs = await new Promise(function(resolve,reject){
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
            } catch (error) {      
              return h.response(error).code(404);
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