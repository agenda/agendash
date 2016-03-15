var path = require('path')

module.exports = function (_agenda, middleware) {
  if (!middleware) {
    middleware = 'express';
  }

  var agendash = require('./lib/agendash')(_agenda)

  try {
    var middlewarePath = path.join(__dirname, 'lib/middlewares', middleware);

    return require(middlewarePath)(agendash);
  } catch (error) {
    throw new Error('No middleware available for ' + middleware);
  }
};
