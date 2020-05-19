const path = require('path');
const pack = require('../../package.json');

module.exports = agendash => {
  const { api, requeueJobs, deleteJobs, createJob} = agendash
  return {
    pkg: pack,
    register: (server, options) => {
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
          handler: (request, h) => {

            let { job, state, limit, skip, q, property, isObjectId } = request.query;
            return api(job, state, {query: q, property, isObjectId, skip, limit})
              .then( apiResponse => {
                return apiResponse
              })
              .catch( err => {
                return h.response(err).code(400)
              })
          },
          config: {
            auth: options.auth || false
          }
        },
        {
          method: 'POST',
          path: '/api/jobs/requeue',
          handler: (request, h) => {
            return requeueJobs(request.payload.jobIds)
              .then( newJobs => h.response(newJobs))
              .catch( err => h.response(err).code(404))
          },
          config: {
            auth: options.auth || false
          }
        },
        {
          method: 'POST',
          path: '/api/jobs/delete',
          handler: (request, h) => {

            return deleteJobs(request.payload.jobIds)
              .then( deleted => {
                if(deleted){
                  return h.response({deleted: true})
                } else {
                  return h.response(err).code(404)
                }
              })
              .catch( err => res.status(404).json(err))
          },
          config: {
            auth: options.auth || false
          }
        },
        {
          method: 'POST',
          path: '/api/jobs/create',
          handler: (request, h) => {

            return createJob(request.payload.jobName, request.payload.jobSchedule, request.payload.jobRepeatEvery, request.payload.jobData)
              .then( () => h.response({created: true}))
              .catch( err => h.response(err).code(404))

          },
          config: {
            auth: options.auth || false
          }
        }
      ]);
    }
  };
};
