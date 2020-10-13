const { DataTypes, Model } = require('sequelize')
const sequelize = require('../config/database')

class ParkingSpace extends Model {}

ParkingSpace.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrementIdentity: true
    },
    name: {
      type: DataTypes.STRING(32),
      allowNull: false,
      unique: true
    },
    description: {
      type: DataTypes.STRING(128)
    },
    isOccupied: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    amperageCapacity: {
      type: DataTypes.INTEGER
    },
    spaceType: {
      type: DataTypes.ENUM,
      allowNull: false,
      values: ['rv', 'mobile home', 'storage']
    }
  },
  {
    sequelize,
    modelName: 'ParkingSpace',
    tableName: 'parking_spaces',
    underscored: true
  }
)

module.exports = ParkingSpace
