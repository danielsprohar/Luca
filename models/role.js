const { DataTypes, Model } = require('sequelize')
const sequelize = require('../config/database')
const User = require('./user')

class Role extends Model {}

Role.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrementIdentity: true
    },
    name: {
      type: DataTypes.STRING(64),
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: 'Role'
  }
)

Role.belongsToMany(User, { through: 'user_roles' })

module.exports = Role
