'use strict';
const path = require('path');

module.exports = (agenda, options) => {
  options = options || {};
  if (!options.middleware) {
    options.middleware = 'express';
  }
  if (!options.apiMiddleware) {
    options.apiMiddleware = [];
  }

  const agendash = require('./lib/agendash')(agenda, options);

  try {
    const middlewarePath = path.join(__dirname, 'lib/middlewares', options.middleware);
    return require(middlewarePath)(agendash, options);
  } catch (err) {
    throw new Error('No middleware available for ' + options.middleware);
  }
};
