const path = require("path");
const csp = require("../csp");

module.exports = (agendash) => (instance, opts, done) => {
  const { api, requeueJobs, deleteJobs, createJob } = agendash;

  instance.register(require("@fastify/static"), {
    root: path.join(__dirname, "../../public"),
  });

  instance.get("/", function (req, reply) {
    reply.header("Content-Security-Policy", csp);
    return reply.sendFile("index.html");
  });

  instance.get("/api", async (request, response) => {
    try {
      const {
        job,
        state,
        skip,
        limit,
        q,
        property,
        isObjectId,
      } = request.query;
      const apiResponse = await api(job, state, {
        query: q,
        property,
        isObjectId,
        skip,
        limit,
      });
      response.send(apiResponse);
    } catch (error) {
      response.status(400).send(error);
    }
  });

  instance.post("/api/jobs/requeue", async (request, response) => {
    try {
      const newJobs = await requeueJobs(request.body.jobIds);
      response.send(newJobs);
    } catch (error) {
      response.status(404).send(error);
    }
  });

  instance.post("/api/jobs/delete", async (request, response) => {
    try {
      const deleted = await deleteJobs(request.body.jobIds);
      if (deleted) {
        response.send({ deleted: true });
      } else {
        response.send({ message: "Jobs not deleted" });
      }
    } catch (error) {
      response.status(404).send(error);
    }
  });

  instance.post("/api/jobs/create", async (request, response) => {
    try {
      await createJob(
        request.body.jobName,
        request.body.jobSchedule,
        request.body.jobRepeatEvery,
        request.body.jobData
      );
      response.send({ created: true });
    } catch (error) {
      response.status(400).send(error);
    }
  });

  done();
};
