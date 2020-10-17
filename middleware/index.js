const admin = require('./admin')
const auth = require('./auth')
const errorHandler = require('./error-handler')
const paramValidation = require('./param-validation')

module.exports = {
  /**
   * Checks if the user has administrator privileges.
   */
  admin,

  /**
   * Checks if a valid JWT token is present in the HTTP headers.
   */
  auth,

  errorHandler,

  /**
   * Checks if the 'id' parameter in the request route is an instance of Number.
   */
  paramValidation
}
