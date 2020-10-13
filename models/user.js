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
      allowNull: false
    },
    normalizedEmail: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'normalized_email'
    }
  },
  {
    sequelize,
    modelName: 'User'
  }
)

User.sync()
module.exports = User
