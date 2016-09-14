var path = require('path')

module.exports = function (agenda, options) {
  options = options || {}
  if (!options.middleware) {
    options.middleware = 'express'
  }

  var agendash = require('./lib/agendash')(agenda, options)

  try {
    var middlewarePath = './lib/middlewares/' + options.middleware;
    return require(middlewarePath)(agendash, options)
  } catch (error) {
    throw new Error('No middleware available for ' + options.middleware)
  }
}
