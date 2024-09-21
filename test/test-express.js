const test = require("ava");
const supertest = require("supertest");
const express = require("express");
const { setupAgenda } = require("./helpers/test-setup");

let agenda;
let app;
let request;

test.before(async () => {
  agenda = await setupAgenda();

  app = express();
  app.use("/", require("../app")(agenda));
  request = supertest(app);
});

test.beforeEach(async () => {
  await agenda.cancel({});
});

test.after.always(async () => {
  await agenda.stop();
});

test.serial("GET /api with no jobs should return the correct overview", async (t) => {
  const response = await request.get("/api?limit=200&skip=0");
  t.is(response.body.overview[0].displayName, "All Jobs");
  t.is(response.body.jobs.length, 0);
});

test.serial("POST /api/jobs/create should confirm the job exists", async (t) => {
  const response = await request
    .post("/api/jobs/create")
    .send({
      jobName: "Test Job",
      jobSchedule: "in 2 minutes",
      jobRepeatEvery: "",
      jobData: {},
    })
    .set("Accept", "application/json");

  t.true("created" in response.body);

  const jobs = await agenda.jobs();
  t.is(jobs.length, 1, "Expected one document in database");
});

test.serial("POST /api/jobs/delete should delete the job", async (t) => {
  const job = await agenda
    .create("Test Job", {})
    .schedule("in 4 minutes")
    .save();

  const response = await request
    .post("/api/jobs/delete")
    .send({
      jobIds: [job.attrs._id],
    })
    .set("Accept", "application/json");

  t.true("deleted" in response.body);

  const jobs = await agenda.jobs();
  t.is(jobs.length, 0);
});

test.serial("POST /api/jobs/requeue should requeue the job", async (t) => {
  const job = await agenda
    .create("Test Job", {})
    .schedule("in 4 minutes")
    .save();

  const response = await request
    .post("/api/jobs/requeue")
    .send({
      jobIds: [job.attrs._id],
    })
    .set("Accept", "application/json");

  t.false("newJobs" in response.body);

  const jobs = await agenda.jobs();
  t.is(jobs.length, 2);
});
