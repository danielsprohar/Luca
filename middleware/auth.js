const { httpStatusCodes } = require('../constants')
const jwt = require('jsonwebtoken')
const logger = require('../config/winston')

module.exports = function isAuthenticated(req, res, next) {
  if (!req.headers.authorization) {
    return res.status(httpStatusCodes.unauthorized).send('No token')
  }

  const authHeader = req.headers.authorization.split(' ')
  const headerName = authHeader[0] // Should be "Bearer"
  if (headerName !== 'Bearer') {
    return res
      .status(httpStatusCodes.badRequest)
      .send('Invalid authorization header value')
  }

  const token = authHeader[1] // Should be the JWT token

  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY)
    req.user = decoded
  } catch (error) {
    logger.error(error)
    return res.status(httpStatusCodes.unauthorized).send('Invalid token')
  }

  next()
}
