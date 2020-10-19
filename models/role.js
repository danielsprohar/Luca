const { DataTypes, Model } = require('sequelize')
const sequelize = require('../config/database')
const Joi = require('joi')

// ===========================================================================

class Role extends Model {
  /**
   * Ensure that `req.body` has the required fields to create a new tuple.
   * @param {*} role
   */
  static validateInsert(role) {
    const schema = Joi.object({
      name: Joi.string().min(1).max(64)
    })

    return schema.validate(role)
  }

  /**
   * Ensure that the `req.body` has the required fields to update an existing tuple.
   * @param {*} role
   */
  static validateUpdate(role) {
    const schema = Joi.object({
      name: Joi.string().min(1).max(64)
    })

    return schema.validate(role)
  }
}

// ===========================================================================

Role.init(
  {
    name: {
      type: DataTypes.STRING(64),
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: 'Role',
    tableName: 'roles'
  }
)

// ===========================================================================

module.exports = Role
