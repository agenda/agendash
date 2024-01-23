#!/usr/bin/env node
"use strict";
const { Agenda } = require("agenda");
const agendash = require("../app");
const Hapi = require("@hapi/hapi");
const program = require("commander");

program
  .option(
    "-d, --db <db>",
    "[required] Mongo connection string, same as Agenda connection string"
  )
  .option(
    "-c, --collection <collection>",
    "[optional] Mongo collection, same as Agenda collection name, default agendaJobs",
    "agendaJobs"
  )
  .option(
    "-p, --port <port>",
    "[optional] Server port, default 3000",
    (n, d) => Number(n) || d,
    3000
  )
  .option(
    "-t, --title <title>",
    "[optional] Page title, default Agendash",
    "Agendash"
  )
  .parse(process.argv);

if (!program.db) {
  console.error("--db required");
  process.exit(1);
}

const init = async () => {
  const server = Hapi.server({
    port: 3002,
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
