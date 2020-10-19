const { DataTypes, Model } = require('sequelize')
const sequelize = require('../config/database')
const Joi = require('joi')

// ===========================================================================

class Payment extends Model {
  /**
   * Ensure that `req.body` has the required fields to create a new tuple.
   * @param {*} payment
   */
  static validateInsert(payment) {
    const schema = Joi.object({
      amount: Joi.number().min(1).required(),
      paymentMethod: Joi.string().min(1).max(128).required(),
      customerId: Joi.number().min(1).required(),
      details: Joi.string().max(2048)
    })

    return schema.validate(payment)
  }
}

// ===========================================================================

Payment.init(
  {
    amount: {
      type: DataTypes.DECIMAL(7, 2),
      allowNull: false
    },
    paymentMethod: {
      type: DataTypes.ENUM,
      allowNull: false,
      field: 'payment_method',
      values: ['cash', 'check', 'credit', 'debit', 'money order']
    },
    details: {
      type: DataTypes.STRING(2048)
    }
  },
  {
    sequelize,
    modelName: 'Payment',
    tableName: 'payments',
    underscored: true
  }
)

// ===========================================================================

module.exports = Payment
