#!/usr/bin/env node
"use strict";
const { Agenda } = require("agenda");
const agendash = require("../app");
const Koa = require("koa");
const program = require("./agendash-options");

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
