const path = require("path");
const bodyParser = require("koa-bodyparser");
const Router = require("koa-router");
const koaStatic = require("koa-static");
const csp = require("../csp");

module.exports = (agendash) => {
  const middlewares = [];

  middlewares.push(async (ctx, next) => {
    await next();
    ctx.set("Content-Security-Policy", csp);
  });

  middlewares.push(
    koaStatic(path.resolve(__dirname, "../../public"), { defer: true })
  );

  middlewares.push(bodyParser());

  const routerApi = new Router();

  routerApi.get("/api", async ({ response, query }) => {
    const { job, state, skip, limit, q, property, isObjectId } = query;
    try {
      response.body = await agendash.api(job, state, {
        query: q,
        property,
        isObjectId,
        skip,
        limit,
      });
    } catch (error) {
      response.status = 400;
      response.body = error;
    }
  });

  routerApi.post("/api/jobs/requeue", async ({ request, response }) => {
    try {
      response.body = await agendash.requeueJobs(request.body.jobIds);
    } catch (error) {
      response.status = 404;
      response.body = error;
    }
  });

  routerApi.post("/api/jobs/delete", async ({ request, response }) => {
    try {
      await agendash.deleteJobs(request.body.jobIds);
      response.body = {
        deleted: true,
      };
    } catch (error) {
      response.status = 404;
      response.body = error;
    }
  });

  routerApi.post("/api/jobs/create", async ({ request, response }) => {
    const { jobData, jobName, jobSchedule, jobRepeatEvery } = request.body;

    try {
      await agendash.createJob(jobName, jobSchedule, jobRepeatEvery, jobData);
      response.body = {
        created: true,
      };
    } catch (error) {
      response.status = 404;
      response.body = error;
    }
  });

  middlewares.push(routerApi.middleware());

  return middlewares;
};
