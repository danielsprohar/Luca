const { DataTypes, Model } = require('sequelize')
const sequelize = require('../config/database')
const Joi = require('joi')

// ===========================================================================

class User extends Model {
  /**
   * Ensure that `req.body` has the required fields to create a new tuple.
   * @param {User} user
   * @returns {boolean} `true` if the request body has the proper fields; otherwise `false`.
   */
  static validateLogin(user) {
    const schema = Joi.object({
      email: Joi.string().min(1).max(255).required(),
      password: Joi.string().min(1).max(255).required()
    })

    return schema.validate(user)
  }

  /**
   * Ensure that `req.body` has the required fields to create a new tuple.
   * @param {User} user
   */
  static validateInsert(user) {
    const schema = Joi.object({
      email: Joi.string().min(1).max(255).required(),
      password: Joi.string().min(1).max(255).required()
    })

    return schema.validate(user)
  }

  /**
   * Ensure that the `req.body` has the required fields to update an existing tuple.
   * @param {User} user
   */
  static validateUpdate(user) {
    const schema = Joi.object({
      email: Joi.string().min(1).max(255)
    })

    return schema.validate(user)
  }
}

// ===========================================================================

User.init(
  {
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    normalizedEmail: {
      type: DataTypes.STRING(255)
    },
    // https://www.npmjs.com/package/bcrypt#hash-info
    hashedPassword: {
      type: DataTypes.STRING(64),
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    underscored: true
  }
)

// ===========================================================================

module.exports = User
