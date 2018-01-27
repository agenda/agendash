const bodyParser = require('koa-bodyparser');
const Router = require('koa-router');
const serve = require('koa-static');
const path = require('path');

module.exports = agendash => {
    const parser = bodyParser({
        onerror(error, ctx) {
            ctx.throw(`cannot parse request body, ${JSON.stringify(error)}`, 400);
        }
    })
    const router = new Router();
    const routes = router.routes();
    const serveStatic = serve(path.join(__dirname, '../../public'));

    router.get('/api', (ctx, next) => {
        agendash.api(ctx.request.query.job, ctx.request.query.state, (err, apiResponse) => {
            if (err) {
                ctx.status = 400
                ctx.body = err
            } else {
                ctx.body = apiResponse
            }
            next();
        })
    })

    router.post('/api/jobs/requeue', (ctx, next) => {
        agendash.requeueJobs(ctx.request.body.jobIds, (err, newJobs) => {
            if (err || !newJobs) {
                ctx.status = 404;
                ctx.body = err;
            } else {
                ctx.body = newJobs;
            }
            next();
        })
    })

    router.post('/api/jobs/delete', (ctx, next) => {
        agendash.deleteJobs(ctx.request.body.jobIds, (err, deleted) => {
            if (err) {
                ctx.status = 404;
                ctx.body = err;
            } else {
                ctx.body = {
                    deleted: true
                };
            }
            next();
        })
    })

    router.post('/api/jobs/create', (ctx, next) => {
        agendash.createJob(ctx.request.body.jobName, ctx.request.body.jobSchedule,
            ctx.request.body.jobRepeatEvery, ctx.request.body.jobData, (err, deleted) => {
                if (err) {
                    ctx.status = 404;
                    ctx.body = err;
                } else {
                    ctx.body = {
                        created: true
                    };
                }
                next();
            })
    })

    const agendashMiddleware = (ctx, next) => {
        return parser.call(this, ctx, () => routes.call(this, ctx, () => serveStatic.call(this, ctx, next)))
    };

    // for external access to the router instance
    agendashMiddleware.router = router;

    return agendashMiddleware;
};
