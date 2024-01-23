"use strict";
const path = require("path");

module.exports = async (agenda, options) => {
  options = options || {};
  if (!options.middleware) {
    options.middleware = "express";
  }

  const agendashPromise = require("./lib/controllers/agendash")(
    agenda,
    options
  );

  const agendash = await agendashPromise;
  const middlewarePath = path.join(
    __dirname,
    "./lib/middlewares",
    options.middleware
  );

  try {
    return require(middlewarePath)(agendash);
  } catch (error) {
    console.error(error);
    throw new Error(`Middleware load failed with ${JSON.stringify(options)}`);
  }
};
