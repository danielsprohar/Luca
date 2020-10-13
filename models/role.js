const { DataTypes, Model } = require('sequelize')
const sequelize = require('../config/database')

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

Role.sync()
module.exports = Role
