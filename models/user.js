const { DataTypes, Model } = require('sequelize')
const sequelize = require('../config/database')

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
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'normalized_username'
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
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'normalized_email'
    },
    hashedPassword: {
      type: DataTypes.STRING(64),
      allowNull: false,
      field: 'hashed_password',
      validate: {
        is: /^[0-9a-f]{64}$/i
      }
    }
  },
  {
    sequelize,
    modelName: 'User'
  }
)

User.sync()
module.exports = User
