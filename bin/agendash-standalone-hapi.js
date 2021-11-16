#!/usr/bin/env node
"use strict";
const { Agenda } = require("agenda");
const agendash = require("../app");
const Hapi = require("@hapi/hapi");
const program = require("./agendash-options");

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
};

process.on("unhandledRejection", (error) => {
  console.log(error);
  process.exit(1);
});

init();
