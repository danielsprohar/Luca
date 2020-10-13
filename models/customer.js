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
      allowNull: false,
      field: 'first_name'
    },
    middleName: {
      type: DataTypes.STRING(32),
      field: 'middle_name'
    },
    lastName: {
      type: DataTypes.STRING(32),
      allowNull: false,
      field: 'last_name'
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
      allowNull: false,
      field: 'normalized_email'
    },
    gender: {
      type: DataTypes.STRING(8),
      allowNull: false
    },
    dlNumber: {
      type: DataTypes.STRING(32),
      field: 'dl_number'
    },
    dlState: {
      type: DataTypes.STRING(32),
      field: 'dl_state'
    },
    dlPhotoUrl: {
      type: DataTypes.STRING(2048),
      field: 'dl_photo_url'
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
      field: 'is_active'
    }
  },
  {
    sequelize,
    modelName: 'Customer',
    tableName: 'customers',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
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
