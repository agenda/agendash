const test = require("ava");
const supertest = require("supertest");
const Fastify = require("fastify");
const Agenda = require("agenda");

const agenda = new Agenda().database(
  "mongodb://127.0.0.1/agendash-test-db",
  "agendash-test-collection",
  { useUnifiedTopology: true }
);

const fastify = Fastify();

fastify.register(
  require("../app")(agenda, {
    middleware: 'fastify',
  })
);

const request = supertest(fastify.server);

test.before.cb((t) => {
  agenda.on("ready", () => {
    t.end();
  });
});

test.before(async () => {
  await fastify.ready()
});

test.beforeEach(async () => {
  await agenda._collection.deleteMany({}, null);
});

test.serial(
  "GET /api with no jobs should return the correct overview",
  async (t) => {
    const response = await request.get("/api?limit=200&skip=0");

    t.is(response.body.overview[0].displayName, "All Jobs");
    t.is(response.body.jobs.length, 0);
  }
);

test.serial(
  "POST /api/jobs/create should confirm the job exists",
  async (t) => {
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

    agenda._collection.count({}, null, (error, result) => {
      t.falsy(error);
      if (result !== 1) {
        throw new Error("Expected one document in database");
      }
    });
  }
);

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

  const count = await agenda._collection.count({}, null);
  t.is(count, 0);
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

  const count = await agenda._collection.count({}, null);
  t.is(count, 2);
});
