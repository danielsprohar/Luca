const { httpStatusCodes } = require('../constants')
const jwt = require('jsonwebtoken')
const debug = require('debug')('luca:middleware:auth')

module.exports = function (req, res, next) {
  if (!req.headers.authorization) {
    return res.status(httpStatusCodes.unauthorized).send('No token')
  }

  const authHeader = req.headers.authorization.split(' ')
  const headerName = authHeader[0] // Should be "Bearer"
  if (headerName !== 'Bearer') {
    return res.status(httpStatusCodes.badRequest).send('Invalid authorization header value')
  }

  const token = authHeader[1] // Should be the JWT token

  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY)
    req.user = decoded
  } catch (error) {
    debug(error)
    return res.status(httpStatusCodes.unauthorized).send('Invalid token')
  }

  next()
}
