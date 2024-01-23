#!/usr/bin/env node
"use strict";
const Agenda = require("agenda");
const agendash = require("../app");
const Fastify = require("fastify");
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
  .option(
    "-p, --path <path>",
    "[optional] Path to bind Agendash to, default /",
    "/"
  )
  .parse(process.argv);

if (!program.db) {
  console.error("--db required");
  process.exit(1);
}

if (!program.path.startsWith("/")) {
  console.error("--path must begin with /");
  process.exit(1);
}

const fastify = Fastify();

const agenda = new Agenda().database(program.db, program.collection);

fastify.register(
  agendash(agenda, {
    middleware: "fastify",
    title: program.title,
  })
);

fastify.listen({ port: program.port }, function () {
  console.log(
    `Agendash started http://localhost:${program.port}${program.path}`
  );
});
