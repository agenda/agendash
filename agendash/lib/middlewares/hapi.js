const path = require("path");
const pack = require("../../package.json");
const csp = require("../csp");

module.exports = (agendash) => {
  const { api, requeueJobs, deleteJobs, createJob } = agendash;
  return {
    pkg: pack,
    register: (server, options) => {
      server.ext("onPreResponse", (req, h) => {
        req.response.header("Content-Security-Policy", csp);
        return h.continue;
      });

      server.route([
        {
          method: "GET",
          path: "/{param*}",
          handler: {
            directory: {
              path: path.join(__dirname, "../../public"),
            },
          },
          config: {
            auth: options.auth || false,
          },
        },
        {
          method: "GET",
          path: "/api",
          handler(request) {
            const {
              job,
              state,
              limit,
              skip,
              q,
              property,
              isObjectId,
            } = request.query;
            return api(job, state, {
              query: q,
              property,
              isObjectId,
              skip,
              limit,
            });
          },
          config: {
            auth: options.auth || false,
          },
        },
        {
          method: "POST",
          path: "/api/jobs/requeue",
          handler(request) {
            return requeueJobs(request.payload.jobIds);
          },
          config: {
            auth: options.auth || false,
          },
        },
        {
          method: "POST",
          path: "/api/jobs/delete",
          async handler(request, h) {
            const deleted = await deleteJobs(request.payload.jobIds);
            if (deleted) {
              return h.response({ deleted: true });
            }

            return h.code(404);
          },
          config: {
            auth: options.auth || false,
          },
        },
        {
          method: "POST",
          path: "/api/jobs/create",
          async handler(request, h) {
            const created = await createJob(
              request.payload.jobName,
              request.payload.jobSchedule,
              request.payload.jobRepeatEvery,
              request.payload.jobData
            );
            if (created) {
              return h.response({ created: true });
            }

            return h.code(404);
          },
          config: {
            auth: options.auth || false,
          },
        },
      ]);
    },
  };
};
