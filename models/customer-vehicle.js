const { DataTypes, Model, Deferrable } = require('sequelize')
const sequelize = require('../config/database')

class CustomerVehicle extends Model {}

CustomerVehicle.init(
  {
    customerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        key: 'id',
        model: 'Customer',
        deferrable: Deferrable.INITIALLY_IMMEDIATE
      }
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1901
      }
    },
    make: {
      type: DataTypes.STRING(32),
      allowNull: false
    },
    model: {
      type: DataTypes.STRING(32),
      allowNull: false
    },
    licensePlateNo: {
      type: DataTypes.STRING(32),
      allowNull: false
    },
    licensePlateState: {
      type: DataTypes.STRING(32),
      allowNull: false
    },
    photoUrl: {
      type: DataTypes.STRING(2048),
      validate: {
        isUrl: true
      }
    }
  },
  {
    sequelize,
    modelName: 'CustomerVehicle',
    tableName: 'customer_vehicles',
    underscored: true
  }
)

module.exports = CustomerVehicle
