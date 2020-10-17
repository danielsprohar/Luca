const { httpStatusCodes } = require('../constants')

module.exports =
  /**
   * Checks if the user has administrator privileges.
   */
  function (req, res, next) {
    if (!req.user.isAdmin) {
      return res.status(httpStatusCodes.forbidden).send()
    }

    next()
  }
