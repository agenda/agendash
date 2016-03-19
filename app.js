var path = require('path')

module.exports = function (agenda, options) {
  options = options || {}
  if (!options.middleware) {
    options.middleware = 'express'
  }

  var agendash = require('./lib/agendash')(agenda, options)

  try {
    var middlewarePath = path.join(__dirname, 'lib/middlewares', options.middleware)
    return require(middlewarePath)(agendash)
  } catch (error) {
    throw new Error('No middleware available for ' + options.middleware)
  }
}
