#!/usr/bin/env node
"use strict";
const program = require("./agendash-options");

const http = require("http");
const { Agenda } = require("agenda");
const agendash = require("../app");
const express = require("express");

const app = express();

const agenda = new Agenda().database(program.db, program.collection);
app.use(
  program.path,
  agendash(agenda, {
    title: program.title,
  })
);

app.set("port", program.port);

const server = http.createServer(app);
server.listen(program.port, () => {
  console.log(
    `Agendash started http://localhost:${program.port}${program.path}`
  );
});
