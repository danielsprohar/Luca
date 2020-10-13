const { DataTypes, Model } = require('sequelize')
const sequelize = require('../config/database')
const CustomerVehicle = require('./customer-vehicle')

class Customer extends Model {}

Customer.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrementIdentity: true
    },
    firstName: {
      type: DataTypes.STRING(32),
      allowNull: false
    },
    middleName: {
      type: DataTypes.STRING(32)
    },
    lastName: {
      type: DataTypes.STRING(32),
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING(32),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(254),
      allowNull: false,
      validate: {
        isEmail: true
      }
    },
    normalizedEmail: {
      type: DataTypes.STRING(254),
      allowNull: false
    },
    gender: {
      type: DataTypes.STRING(8),
      allowNull: false
    },
    dlNumber: {
      type: DataTypes.STRING(32)
    },
    dlState: {
      type: DataTypes.STRING(32)
    },
    dlPhotoUrl: {
      type: DataTypes.STRING(2048)
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: 'Customer',
    tableName: 'customers',
    underscored: true,
    indexes: [
      {
        name: 'customer_full_name',
        fields: ['first_name', 'last_name']
      }
    ]
  }
)

Customer.hasMany(CustomerVehicle)

module.exports = Customer
