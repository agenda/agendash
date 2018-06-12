# Middlewares
## Hapi
Works with [Hapijs](https://hapijs.com/) >= v17
### usage
First install the dependencies in your app:
```bash
yarn add hapi inert agenda
```
Then use it as follows:
```javascript
'use strict';

const Hapi = require('hapi');
var Agenda = require('agenda');
var Agendash = require('agendash');

var agenda = new Agenda({
    db: { address: '<mongoUrl>'
});

const server = Hapi.server({
  port: 3000,
  host: 'localhost'
});

const init = async () => {

  await server.register(
    require('inert'),
    {
      plugin: Agendash(agenda, {
        middleware: 'hapi'
        // can place other options (e.g. title) here
      }),
      options: {},
      routes: {
        prefix: '/agendash'
      }
    }
  );

  await server.start();
  console.log(`Server running at: ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});

init();
```