const winston = require('../config/winston')

module.exports = function handleError(err, req, res, next) {
  winston.error(err.message, err)
  res.status(500).send()
}
