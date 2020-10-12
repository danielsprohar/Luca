const { DataTypes, Model } = require('sequelize')
const sequelize = require('../config/database')

class Customer extends Model {}

Customer.init(
  {
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
      allowNull: false
    },
    gender: {
      type: DataTypes.STRING(8),
      allowNull: false
    },
    normalizedEmail: {
      type: DataTypes.STRING(254),
      allowNull: false
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
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
    }
  },
  {
    sequelize,
    modelName: 'Customer'
  }
)

Customer.sync()

module.exports = Customer
