const { DataTypes, Model } = require('sequelize')
const sequelize = require('../config/database')

// ===========================================================================

class Payment extends Model {
  /**
   * Ensure that `req.body` has the required fields to create a new tuple.
   * @param {*} payment
   */
  validateInsert(payment) {
    const schema = Joi.object({
      amount: Joi.number().min(1).required(),
      paymentMethod: Joi.string().min(1).max(128).required(),
      details: Joi.string().max(2048)
    })

    return schema.validate(payment)
  }
}

// ===========================================================================

Payment.init(
  {
    amount: {
      type: DataTypes.DECIMAL,
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
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
)

// ===========================================================================

module.exports = Payment
