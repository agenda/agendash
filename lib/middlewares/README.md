# Middlewares

## Hapi

Works with [Hapijs](https://hapijs.com/) >= v18

### usage

First install the dependencies in your app:

```bash
npm install @hapi/hapi @hapi/inert agenda agendash
```

Then use it as follows:

```javascript
'use strict';

const Hapi = require('hapi');
const { Agenda } = require('agenda');
const Agendash = require('agendash');

var agenda = new Agenda({
    db: { address: '<mongoUrl>'
});

const server = Hapi.server({
  port: 3000,
  host: 'localhost'
});

const init = async () => {

  await server.register(
    require('@hapi/inert'),
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
