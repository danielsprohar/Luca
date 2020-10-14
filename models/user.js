const { DataTypes, Model } = require('sequelize')
const sequelize = require('../config/database')
const Joi = require('joi')

// ===========================================================================

class User extends Model {
  /**
   * Ensure that `req.body` has the required fields to create a new tuple.
   * @param {*} user
   */
  static validateInsert(user) {
    const schema = Joi.object({
      username: Joi.string().min(1).max(255).required(),
      email: Joi.string().min(1).max(255).required(),
      password: Joi.string().min(1).max(255).required()
    })

    return schema.validate(user)
  }

  /**
   * Ensure that the `req.body` has the required fields to update an existing tuple.
   * @param {*} user
   */
  static validateUpdate(user) {
    const schema = Joi.object({
      username: Joi.string().min(1).max(255),
      email: Joi.string().min(1).max(255)
    })

    return schema.validate(user)
  }
}

// ===========================================================================

User.init(
  {
    username: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    normalizedUsername: {
      type: DataTypes.STRING(255)
    },
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
    hashedPassword: {
      type: DataTypes.STRING(64),
      allowNull: false
      // validate: {
      //   is: /^[0-9a-f]{64}$/i
      // }
    }
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
)

// ===========================================================================
// Model validation
// ===========================================================================
function validate(user) {
  const schema = Joi.object({
    username: Joi.string().min(1).max(255).required(),
    email: Joi.string().min(1).max(255).required(),
    password: Joi.string().min(1).max(255).required()
  })

  return schema.validate(user)
}

// ===========================================================================

module.exports.User = User
