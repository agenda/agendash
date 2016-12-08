var bodyParser = require('koa-bodyparser')
var Router = require('koa-router')
var serve = require('koa-static');
var path = require('path');

module.exports = (agendash) => {
    var parser = bodyParser({
        onerror(error, ctx) {
            ctx.throw(`cannot parse request body, ${JSON.stringify(error)}`, 400)
        }
    })

    var router = new Router()

    router.get('/api', function (ctx, next) {
        agendash.api(ctx.request.query.job, ctx.request.query.state, function (err, apiResponse) {
            if (err) {
                ctx.status = 400
                ctx.body = err
            } else
                ctx.body = apiResponse
            next()
        })
    })

    router.post('/api/jobs/requeue', function (ctx, next) {
        agendash.requeueJobs(ctx.request.body.jobIds, function (err, newJobs) {
            if (err || !newJobs) {
                ctx.status = 404
                ctx.body = err
            } else
                ctx.body = newJobs
            next()
        })
    })

    router.post('/api/jobs/delete', function (ctx, next) {
        agendash.deleteJobs(ctx.request.body.jobIds, function (err, deleted) {
            if (err) {
                ctx.status = 404
                ctx.body = err
            } else
                ctx.body = {deleted: true}
            next()
        })
    })

    router.post('/api/jobs/create', function (ctx, next) {
        agendash.createJob(ctx.request.body.jobName, ctx.request.body.jobSchedule,
            ctx.request.body.jobRepeatEvery, ctx.request.body.jobData, function (err, deleted) {
                if (err) {
                    ctx.status = 404
                    ctx.body = err
                } else
                    ctx.body = {created: true}
                next()
            })
    })

    function middleware (ctx, next) {
        return parser.call(this, ctx,
            () => router.routes().call(this, ctx,
                () => serve(path.join(__dirname, '../../public')).call(this, ctx, next)))
    }

    return middleware
}
