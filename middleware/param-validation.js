const debug = require('debug')('luca:routing')
const winston = require('../config/winston')
const { httpStatusCodes } = require('../constants')

module.exports = function (req, res, next) {
  if (!Number.parseInt(req.params.id)) {
    debug('req.param.id id NOT an instance of a Number')
    winston.info('req.param.id id NOT an instance of a Number')
    return res.status(httpStatusCodes.badRequest).send()
  }
  next()
}
