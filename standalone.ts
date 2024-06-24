#!/usr/bin/env ts-node

import http from 'http';
import { Agenda } from '@sealos/agenda';
import Agendash from './lib/app';
import express from 'express';
import { MongoMemoryServer } from 'mongodb-memory-server';

async function start() {

  const mongoServer = await MongoMemoryServer.create({});

  const agenda = new Agenda({
    db: {
      address: mongoServer.getUri(),
      collection: 'agendash-test-collection',
    },
  });

  const app = express();
  app.use('/', Agendash(agenda));

  let serverPort = process.env.PORT || 3000;
  app.set("port", serverPort);

  const server = http.createServer(app);
  server.listen(serverPort, () => {
    console.log(
      `Agendash started http://localhost:${serverPort}/`
    );
    // print all routes
    app._router.stack.forEach((r: any) => {
      if (r.route && r.route.path) {
        console.log(r.route.path);
      }
    });
  });
}

start().catch((err) => {
  console.error(err);
  process.exit(1);
});
