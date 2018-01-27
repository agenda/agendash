# Middlewares
## Koa
Works with [Koajs](https://github.com/koajs/koa) >= v2
### Usage
First install the dependencies in your app:
```bash
yarn add koa koa-bodyparser koa-router koa-static agenda agendash
```
Then use it as follows:
```javascript
const Agenda = require('agenda');
const agendash = require('agendash');
const Koa = require('koa');

const agenda = new Agenda({
    // configure Agenda https://github.com/agenda/agenda#configuring-an-agenda
    db: {
        address: 'mongodb://localhost/agenda'
    }
});

const app = new Koa();
app.use(agendash(agenda, {
    middleware: 'koa'
    // can place other options (e.g. title) here
}))

app.listen(3000, () => {
    console.log('App listening on port 3000');
})
```

Use [`koa-mount`](https://github.com/koajs/mount/tree/next) if you need to serve the app from a different route
