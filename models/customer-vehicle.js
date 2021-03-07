const Joi = require('joi')
const { DataTypes, Model, Deferrable } = require('sequelize')
const sequelize = require('../config/database')

// ===========================================================================

class CustomerVehicle extends Model {
  /**
   * Ensure that `req.body` has the required fields to create a new tuple.
   * @param {*} vehicle
   */
  static validateInsert(vehicle) {
    const schema = Joi.object({
      customerId: Joi.number().min(1).required(),
      year: Joi.number().min(1901).max(2155).required(),
      make: Joi.string().max(32).required(),
      model: Joi.string().max(32).required(),
      licensePlateNo: Joi.string().max(32).required(),
      licensePlateState: Joi.string().max(32).required(),
      photoUrl: Joi.string().max(2048)
    })

    return schema.validate(vehicle)
  }

  /**
   * Ensure that the `req.body` has the required fields to update an existing tuple.
   * @param {*} vehicle
   */
  static validateUpdate(vehicle) {
    const schema = Joi.object({
      customerId: Joi.number().min(1),
      year: Joi.number().min(1901).max(2155),
      make: Joi.string().max(32),
      model: Joi.string().max(32),
      licensePlateNo: Joi.string().max(32),
      licensePlateState: Joi.string().max(32),
      photoUrl: Joi.string().max(2048)
    })

    return schema.validate(vehicle)
  }
}

// ===========================================================================

CustomerVehicle.init(
  {
    customerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'customer_id',
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
    licensePlateNumber: {
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

// ===========================================================================
// This is a weak entity type
CustomerVehicle.removeAttribute('id')

// ===========================================================================

module.exports = CustomerVehicle
