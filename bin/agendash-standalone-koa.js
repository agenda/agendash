#!/usr/bin/env node
"use strict";
const { Agenda } = require("agenda");
const agendash = require("../app");
const Koa = require("koa");
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
};

process.on("unhandledRejection", (error) => {
  console.log(error);
  process.exit(1);
});

init();
