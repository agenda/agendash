#!/usr/bin/env node
"use strict";
const { Agenda, DataSource } = require("@cawstudios/agenda");
const agendash = require("../app");
const { Command } = require("commander");
const Fastify = require("fastify");

const program = new Command();

program
  .option("-t, --dataSourceType <type>", "Data source type (mongo or postgres)", /^(mongo|postgres)$/i)
  .option("-d, --db <connection>", "DB connection string")
  .option("-c, --collection <name>", "Mongo collection name", "agendaJobs")
  .option("-p, --port <number>", "Server port", parseInt, 3000)
  .option("-t, --title <string>", "Page title", "Agendash")
  .option("-p, --path <path>", "Path to bind Agendash to", "/")
  .parse(process.argv);

const options = program.opts();

// Validation
if (!options.dataSourceType) {
  console.error("--dataSourceType required (mongo or postgres)");
  process.exit(1);
}

if (!options.db) {
  console.error("--db required");
  process.exit(1);
}

if (!options.path.startsWith("/")) {
  console.error("--path must begin with /");
  process.exit(1);
}

// DB Configuration
const dbConfig = {
  [DataSource.POSTGRES]: {
    dataSource: DataSource.POSTGRES,
    dataSourceOptions: { 
      db: {
        connectionString: options.db
      }
    }
  },
  [DataSource.MONGO]: {
    dataSource: DataSource.MONGO,
    dataSourceOptions: { db: { address: options.db, collection: options.collection } }
  }
}[options.dataSourceType];

if (!dbConfig) {
  console.error("Unsupported data source");
  process.exit(1);
}

async function startServer() {
  try {
    const fastify = Fastify();

    const agenda = new Agenda();
    await agenda.database(dbConfig);

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
  } catch (error) {
    console.error("Failed to start Agendash:", error);
    process.exit(1);
  }
}

startServer();
