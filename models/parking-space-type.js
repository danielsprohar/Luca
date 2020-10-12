const { DataTypes, Model } = require('sequelize')
const sequelize = require('../config/database')

class ParkingSpaceType extends Model {}

ParkingSpaceType.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(32),
      allowNull: false
    }
  },
  { sequelize, modelName: 'ParkingSpaceType' }
)

ParkingSpaceType.sync()

module.exports = ParkingSpaceType
