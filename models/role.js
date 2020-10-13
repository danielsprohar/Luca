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
    modelName: 'Role',
    tableName: 'roles',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
)

module.exports = Role
