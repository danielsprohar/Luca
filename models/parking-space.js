const { DataTypes, Model } = require('sequelize')
const sequelize = require('../config/database')
const ParkingSpaceType = require('./parking-space-type')

class ParkingSpace extends Model {}

ParkingSpace.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    label: {
      type: DataTypes.STRING(8),
      allowNull: false,
      unique: true
    },
    rate: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    isAvailable: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING
    },
    amperageCapacity: {
      type: DataTypes.INTEGER
    },
    parkingSpaceTypeId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  { sequelize, modelName: 'ParkingSpace' }
)

ParkingSpace.ParkingSpaceType = ParkingSpace.belongsTo(ParkingSpaceType, {
  foreignKey: 'parking_space_type_id',
  as: 'ParkingSpaceType'
})

ParkingSpace.sync()

module.exports = ParkingSpace
