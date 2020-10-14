const { DataTypes, Model, Deferrable } = require('sequelize')
const sequelize = require('../config/database')
const Joi = require('joi')

// ===========================================================================

class Receipt extends Model {
  /**
   * Ensure that `req.body` has the required fields to create a new tuple.
   * @param {*} receipt
   */
  static validateInsert(receipt) {
    const schema = Joi.object({
      customerId: Joi.number().min(1).required(),
      paymentId: Joi.number().min(1).required()
    })

    return schema.validate(receipt)
  }
}

// ===========================================================================

Receipt.init(
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
    paymentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'payment_id',
      references: {
        key: 'id',
        model: 'Payment',
        deferrable: Deferrable.INITIALLY_IMMEDIATE
      }
    }
  },
  {
    sequelize,
    modelName: 'Receipt',
    tableName: 'receipts',
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
)

// ===========================================================================

module.exports = Receipt
