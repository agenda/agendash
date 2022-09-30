#!/usr/bin/env node
"use strict";
const { Agenda } = require("agenda");
const program = require("./agendash-options");

const agendash = require("../app");
const Hapi = require("@hapi/hapi");
const { attachExitHandlers, cleanupStaleJobs, notifyOnFailure } = require("./utils");

attachExitHandlers();

const init = async () => {
  const server = Hapi.server({
    port: program.port,
    host: "localhost",
  });

  const agenda = new Agenda().database(program.db, program.collection);

  await server.register(require("@hapi/inert"));
  await server.register(
    agendash(agenda, {
      middleware: "hapi",
    })
  );

  await server.start();
  console.log("Server running on %s", server.info.uri);

  cleanupStaleJobs(agenda);
  notifyOnFailure(agenda, program.notify);
};

// noinspection JSIgnoredPromiseFromCall
init();

