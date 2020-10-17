const admin = require('./admin')
const auth = require('./auth')

module.exports = {
  /**
   * Checks if the user has administrator privileges.
   */
  admin,

  /**
   * Checks if a valid JWT token is present in the HTTP headers.
   */
  auth
}
