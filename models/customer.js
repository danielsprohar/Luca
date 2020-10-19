const { DataTypes, Model } = require('sequelize')
const sequelize = require('../config/database')
const Joi = require('joi')

class Customer extends Model {
  /**
   * Ensure that `req.body` has the required fields to create a new tuple.
   * @param {*} customer
   */
  static validateInsert(customer) {
    const schema = Joi.object({
      firstName: Joi.string().min(1).max(32).required(),
      middleName: Joi.string().min(1).max(32),
      lastName: Joi.string().min(1).max(32).required(),
      email: Joi.string().min(1).max(255),
      phone: Joi.string().min(10).max(32),
      dlNumber: Joi.string().min(1).max(32),
      dlState: Joi.string().min(1).max(32),
      dlPhotoUrl: Joi.string().min(1).max(2048)
    })

    return schema.validate(customer)
  }

  /**
   * Ensure that the `req.body` has the required fields to update an existing tuple.
   * @param {*} customer
   */
  static validateUpdate(customer) {
    const schema = Joi.object({
      firstName: Joi.string().min(1).max(32),
      middleName: Joi.string().min(1).max(32),
      lastName: Joi.string().min(1).max(32),
      email: Joi.string().min(1).max(255),
      phone: Joi.string().min(10).max(32),
      dlNumber: Joi.string().min(1).max(32),
      dlState: Joi.string().min(1).max(32),
      dlPhotoUrl: Joi.string().min(1).max(2048)
    })

    return schema.validate(customer)
  }
}

// ===========================================================================

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
      type: DataTypes.STRING(32)
    },
    email: {
      type: DataTypes.STRING(254),
      validate: {
        isEmail: true
      }
    },
    normalizedEmail: {
      type: DataTypes.STRING(254)
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

// ===========================================================================

module.exports = Customer
