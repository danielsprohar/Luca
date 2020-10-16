const { Model } = require('sequelize')
const sequelize = require('../config/database')

class InvoicePayment extends Model {}

// ===========================================================================

InvoicePayment.init(
  {},
  {
    sequelize,
    tableName: 'invoice_payments',
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
)

// ===========================================================================

module.exports = InvoicePayment