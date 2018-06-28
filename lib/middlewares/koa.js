
const path = require('path');
const views = require('koa-views');
const bodyParser = require('koa-bodyparser');
const Router = require('koa-router');
const send = require('koa-send');

const asyncFunc = (fn, ...params) =>
  new Promise((resolve, reject) => {
    fn(...params, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });

const staticFolder = path.resolve(__dirname, '../../public');

const staticPathFormat = (staticPath, prefix) => {
  if (!prefix || prefix === '/') {
    return staticPath;
  }
  return staticPath.replace(prefix, '');
};

const staticMiddleware = prefix => async ctx => {
  await send(ctx, staticPathFormat(ctx.path, prefix), {
    root: staticFolder
  });
};

module.exports = (agendash, options) => {
  const {
    prefix = ''
  } = options;

  if (!prefix) {
    console.warn('You are uising Agendash without router prefix, which probabily make unexpect error.');
  }

  const router = new Router({
    prefix
  });

  router.get(
    '/',
    views(staticFolder),
    async ctx => {
      await ctx.render('index');
    }
  );

  router.get('/api', bodyParser(), async ctx => {
    const {
      job,
      state
    } = ctx.query;
    try {
      const apiResponse = await asyncFunc(agendash.api, job, state);
      ctx.body = apiResponse;
    } catch (err) {
      ctx.status = 400;
      ctx.body = err;
    }
  });

  router.post('/api/jobs/requeue', bodyParser(), async ctx => {
    try {
      const newJobs = await asyncFunc(agendash.requeueJobs, ctx.request.body.jobIds);
      ctx.body = newJobs;
    } catch (err) {
      ctx.status = 404;
      ctx.body = err;
    }
  });

  router.post('/api/jobs/delete', bodyParser(), async ctx => {
    try {
      await asyncFunc(agendash.deleteJobs, ctx.request.body.jobIds);
      ctx.body = {
        deleted: true
      };
    } catch (err) {
      ctx.status = 404;
      ctx.body = err;
    }
  });

  router.post('/api/jobs/create', bodyParser(), async ctx => {
    const {
      jobData,
      jobName,
      jobSchedule,
      jobRepeatEvery
    } = ctx.request.body;

    try {
      await asyncFunc(agendash.createJob, jobName, jobSchedule, jobRepeatEvery, jobData);
      ctx.body = {
        created: true
      };
    } catch (err) {
      ctx.status = 404;
      ctx.body = err;
    }
  });

  router.get(
    '/*',
    staticMiddleware(prefix)
  );

  return router.routes();
};
