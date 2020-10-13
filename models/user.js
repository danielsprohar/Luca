const { DataTypes, Model } = require('sequelize')
const sequelize = require('../config/database')
const Joi = require('joi')

class User extends Model {}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrementIdentity: true
    },
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
      allowNull: false,
      // validate: {
      //   is: /^[0-9a-f]{64}$/i
      // }
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
module.exports.validate = validate
