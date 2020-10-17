const debug = require('debug')('luca:app')
const winston = require('../config/winston')

module.exports = function handleError(err, req, res, next) {
  debug(err)
  winston.error(err.message, err)
  res.status(500).send()
}
