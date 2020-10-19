const { Model } = require('sequelize')
const sequelize = require('../config/database')

class UserRole extends Model {}

// ===========================================================================

UserRole.init(
  {},
  {
    sequelize,
    tableName: 'user_roles',
    underscored: true
  }
)

// ===========================================================================

module.exports = UserRole
