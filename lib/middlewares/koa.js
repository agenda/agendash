var bodyParser = require('koa-bodyparser')
var Router = require('koa-router')
var serveStatic = require('koa-serve-static');

module.exports = (agendash) => {
    var parser = bodyParser({
        onerror(error, ctx) {
            ctx.throw(`cannot parse request body, ${JSON.stringify(error)}`, 400)
        }
    })

    var router = new Router()

    router.get('/', serveStatic(path.join(__dirname, '../../public')))

    router.get('/api', function (ctx, next) {
        agendash.api(ctx.request.query.job, ctx.request.query.state, function (err, apiResponse) {
            if (err) {
                ctx.status = 400
                ctx.body = JSON.stringify(err)
            } else
                ctx.body = apiResponse
            return next()
        })
    })

    router.post('/api/jobs/requeue', function (ctx, next) {
        agendash.requeueJobs(ctx.request.body.jobIds, function (err, newJobs) {
            if (err || !newJobs) {
                ctx.status = 404
                ctx.body = JSON.stringify(err)
            } else
                ctx.body = newJobs
            return next()
        })
    })

    router.post('/api/jobs/delete', function (ctx, next) {
        agendash.deleteJobs(ctx.request.body.jobIds, function (err, deleted) {
            if (err) {
                ctx.status = 404
                ctx.body = JSON.stringify(err)
            } else
                ctx.body = {deleted: true}
            return next()
        })
    })

    router.post('/api/jobs/create', function (ctx, next) {
        agendash.createJob(ctx.request.body.jobName, ctx.request.body.jobSchedule,
            ctx.request.body.jobRepeatEvery, ctx.request.body.jobData, function (err, deleted) {
                if (err) {
                    ctx.status = 404
                    ctx.body = JSON.stringify(err)
                } else
                    ctx.body = {created: true}
                return next()
            })
    })

    function middleware (ctx, next) {
        return router.routes().call(ctx, parser.apply(ctx, [next]))
    }

    return middleware
}
