'use strict';
const path = require('path');

module.exports = (agenda, options) => {
  options = options || {};
  if (!options.middleware) {
    options.middleware = 'express';
  }

  const agendash = require('./lib/controllers/agendash')(agenda, options);

  try {
    const middlewarePath = path.join(__dirname, 'lib/middlewares', options.middleware);
    return require(middlewarePath)(agendash);
  } catch (error) {
    console.log(error);
    throw new Error('No middleware available for ' + options.middleware);
  }
};
