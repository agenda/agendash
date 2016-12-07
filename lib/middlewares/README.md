# Middlewares
## koa
Works with [Koajs](https://github.com/koajs/koa) > v2
### usage
First install the dependencies in your app:
```bash
npm install --save koa@next koa-router koa-bodyparser koa-serve-static agenda
```
Then use it as follows:
```javascript
var Koa = require('koa')
var agenda = new Agenda({
    db: { address: '<mongoUrl>'
})
var agendash = require('agendash')

var app = new Koa()
app.use(agendash(agenda, {
    middleware: 'koa'
    // can place other options (e.g. title) here
}))

app.listen(3000, () = {
    console.log('App listening on port 3000.')
})
```
