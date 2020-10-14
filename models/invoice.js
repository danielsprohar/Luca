const { DataTypes, Model, Deferrable } = require('sequelize')
const sequelize = require('../config/database')
const Joi = require('joi')

// ===========================================================================

class Invoice extends Model {
  /**
   * Ensure that `req.body` has the required fields to create a new tuple.
   * @param {*} invoice
   */
  static validateInsert(invoice) {
    const schema = Joi.object({
      paymentStatus: Joi.string().min(1).max(32).required(),
      rentalAgreementId: Joi.number().min(1).required(),
      paymentDueDate: Joi.date().required(),
      billingPeriodStart: Joi.date().required(),
      billingPeriodEnd: Joi.date().required()
    })

    return schema.validate(invoice)
  }

  /**
   * Ensure that the `req.body` has the required fields to update an existing tuple.
   * @param {*} invoice
   */
  static validateUpdate(invoice) {
    const schema = Joi.object({
      paymentStatus: Joi.string().min(1).max(32),
      rentalAgreementId: Joi.number().min(1),
      paymentDueDate: Joi.date(),
      billingPeriodStart: Joi.date(),
      billingPeriodEnd: Joi.date()
    })

    return schema.validate(invoice)
  }
}

// ===========================================================================

Invoice.init(
  {
    paymentStatus: {
      type: DataTypes.ENUM,
      allowNull: false,
      values: ['not paid', 'paid', 'bad credit']
    },
    rentalAgreementId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'rental_agreement_id',
      references: {
        key: 'id',
        model: 'RentalAgreement',
        deferrable: Deferrable.INITIALLY_IMMEDIATE
      }
    },
    paymentDueDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    billingPeriodStart: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    billingPeriodEnd: {
      type: DataTypes.DATEONLY,
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: 'Invoice',
    tableName: 'invoices',
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
)

// ===========================================================================

module.exports = Invoice
