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
      allowNull: false,
      field: 'is_occupied'
    },
    amperageCapacity: {
      type: DataTypes.INTEGER,
      field: 'amperage_capacity'
    },
    spaceType: {
      type: DataTypes.ENUM,
      allowNull: false,
      field: 'space_type',
      values: ['rv', 'mobile home', 'storage']
    }
  },
  { 
    sequelize, 
    modelName: 'ParkingSpace', 
    tableName: 'parking_spaces',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
)

// TODO: create a m:n relationship with Customers

module.exports = ParkingSpace
