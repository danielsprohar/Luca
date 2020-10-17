const isAdministrator = require('./admin')
const isAuthenticated = require('./auth')
const isValidParamType = require('./param-validation')
const errorHandler = require('./error-handler')

module.exports = {
  /**
   * Checks if the user has administrator privileges.
   */
  isAdministrator,

  /**
   * Checks if a valid JWT token is present in the HTTP headers.
   */
  isAuthenticated,

  errorHandler,

  /**
   * Checks if the 'id' parameter in the request route is an instance of Number.
   */
  isValidParamType
}
