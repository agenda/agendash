const path = require('path');

module.exports = (agenda, options = {}) => {
  if (!options.middleware) {
    options.middleware = 'express';
  }

  const agendash = require('./lib/agendash')(agenda, options);

  try {
    const middlewarePath = path.join(__dirname, 'lib/middlewares', options.middleware);
    return require(middlewarePath)(agendash);
  } catch (error) {
    throw new Error(`No middleware available for ${options.middleware}`);
  }
}
