const debug = require('debug')('luca:app')

module.exports = function (err, req, res, next) {
  debug(err)
  res.status(500).send()
}
