#!/usr/bin/env node

var program = require('commander')
program
  .option('-d, --db <db>', '[required] Mongo connection string, same as Agenda connection string')
  .option('-c, --collection <collection>', '[optional] Mongo collection, same as Agenda collection name, default agendaJobs', 'agendaJobs')
  .option('-p, --port <port>', '[optional] Server port, default 3000', (n, d) => +n || d, 3000)
  .option('-t, --title <title>', '[optional] Page title, default Agendash', 'Agendash')
  .parse(process.argv)

if (!program.db) {
  console.error('--db required')
  process.exit(1)
}

var http = require('http')
var express = require('express')
var app = express()

var Agenda = require('agenda')
var agenda = new Agenda().database(
  program.db,
  program.collection
)
app.use('/', require('../app')(agenda, {
  title: program.title
}))

app.set('port', program.port)

var server = http.createServer(app)
server.listen(program.port)
