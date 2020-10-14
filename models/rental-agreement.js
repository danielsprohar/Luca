const { DataTypes, Model, Deferrable } = require('sequelize')
const sequelize = require('../config/database')
const Joi = require('joi')

class RentalAgreement extends Model {
  static validateInsert(rentalAgreement) {
    const schema = Joi.object({
      recurringDueDate: Joi.number().min(1).max(32).required(),
      recurringRate: Joi.number().min(1).required(),
      isActive: Joi.boolean(),
      agreementType: Joi.string().min(1).required(),
      customerId: Joi.number().required(),
      parkingSpaceId: Joi.number().required()
    })

    return schema.validate(rentalAgreement)
  }

  static validateUpdate(rentalAgreement) {
    const schema = Joi.object({
      recurringDueDate: Joi.number().min(1).max(32),
      recurringRate: Joi.number().min(1),
      isActive: Joi.boolean(),
      agreementType: Joi.string().min(1),
      customerId: Joi.number(),
      parkingSpaceId: Joi.number()
    })

    return schema.validate(rentalAgreement)
  }
}

// ===========================================================================

RentalAgreement.init(
  {
    recurringDueDate: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 31
      }
    },
    recurringRate: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      validate: {
        min: 0
      }
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    agreementType: {
      type: DataTypes.ENUM,
      allowNull: false,
      values: ['daily', 'weekly', 'monthly']
    },
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
    parkingSpaceId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'parking_space_id',
      references: {
        key: 'id',
        model: 'ParkingSpace',
        deferrable: Deferrable.INITIALLY_IMMEDIATE
      }
    }
  },
  {
    sequelize,
    modelName: 'RentalAgreement',
    tableName: 'rental_agreements',
    underscored: true
  }
)

// ===========================================================================

module.exports = RentalAgreement
