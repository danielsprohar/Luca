const { httpStatusCodes } = require('../constants')

module.exports =
  /**
   * Checks if the user has administrator privileges.
   */
  function isAdministrator(req, res, next) {
    if (!req.user || !req.user.isAdmin) {
      return res.status(httpStatusCodes.forbidden).send()
    }

    next()
  }
