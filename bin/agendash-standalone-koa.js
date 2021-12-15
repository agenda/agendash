#!/usr/bin/env node
"use strict";
const { Agenda } = require("agenda");
const program = require("./agendash-options");

const agendash = require("../app");
const Koa = require("koa");
const { attachExitHandlers, cleanupStaleJobs } = require("./utils");

attachExitHandlers();

const init = async () => {
  const agenda = new Agenda().database(program.db, program.collection);

  const app = new Koa();
  const middlewares = agendash(agenda, {
    middleware: "koa",
  });
  for (const middleware of middlewares) {
    app.use(middleware);
  }

  await app.listen(program.port);
  console.log("Server running on port %s", program.port);

  cleanupStaleJobs(agenda);
};

// noinspection JSIgnoredPromiseFromCall
init();
