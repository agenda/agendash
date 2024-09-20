const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const csp = require("../csp");

module.exports = (agendash) => {
  const { api, requeueJobs, deleteJobs, createJob } = agendash;
  const app = express();
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));

  app.use((req, res, next) => {
    res.header("Content-Security-Policy", csp);
    next();
  });

  app.use("/", express.static(path.join(__dirname, "../../public")));

  app.get("/api", async (request, response) => {
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
      response.json(apiResponse);
    } catch (error) {
      console.log(error);
      response.status(400).json(error);
    }
  });

  app.post("/api/jobs/requeue", async (request, response) => {
    try {
      const newJobs = await requeueJobs(request.body.jobIds);
      response.send(newJobs);
    } catch (error) {
      response.status(404).json(error);
    }
  });

  app.post("/api/jobs/delete", async (request, response) => {
    try {
      const deleted = await deleteJobs(request.body.jobIds);
      if (deleted) {
        response.json({ deleted: true });
      } else {
        response.json({ message: "Jobs not deleted" });
      }
    } catch (error) {
      response.status(404).json(error);
    }
  });

  app.post("/api/jobs/create", async (request, response) => {
    try {
      await createJob(
        request.body.jobName,
        request.body.jobSchedule,
        request.body.jobRepeatEvery,
        request.body.jobData
      );
      response.json({ created: true });
    } catch (error) {
      response.status(400).json(error);
    }
  });

  return app;
};
