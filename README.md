# Agendash

A Dashboard for [Agenda](https://github.com/rschmukler/agenda)

---

### Screenshots

![Auto-refresh list of jobs](all-jobs.png)

---

![See job details, requeue or delete jobs](job-details.png)

---

### Install

```
npm install --save agendash
```

### Standalone usage

Agendash comes with a standalone Express app which you can use like this:

```bash
./bin/agendash-standalone --db=mongodb://localhost/agendaDb --collection=agendaCollection --port=3001
```

or like this, for default collection `agendaJobs` and default port `3000`:

```bash
./bin/agendash-standalone --db=mongodb://localhost/agendaDb
```

### Middleware usage

Agendash provides Express middleware you can use at a specified path, for example this will 

```js
var express = require('express');
var app = express();

// ... your other express middleware like body-parser

var Agenda = require('agenda');
var agenda = new Agenda()
  .database('mongodb://127.0.0.1/agendaDb')
app.use('/agendash', require('agendash/middleware/express')(agenda))

// ... your other routes

// ... start your server
```

### Help appreciated

There are several things I would like help with:

-  [ ] I'm rusty with Backbone. Clean up the client code. I wasn't sure on the best way to trigger and handle update events.
-  [ ] Write some tests!
-  [ ] Use Agendash and submit issues!
