'use strict';
const path = require('path');

module.exports = (agenda, options) => {
  options = options || {};
  if (!options.middleware) {
    options.middleware = 'express';
  }

  const agendash = require('./lib/agendash')(agenda, options);

  const middlewarePath = path.join(__dirname, 'lib/middlewares', options.middleware);
  try {
    return require(middlewarePath)(agendash, options);
  } catch (err) {
    throw new Error(`Middleware load failed with ${JSON.stringify(options)}`);
  }
};
