const { Model } = require('sequelize')
const sequelize = require('../config/database')

class InvoicePayment extends Model {}

// ===========================================================================

InvoicePayment.init(
  {},
  {
    sequelize,
    tableName: 'invoice_payments',
    underscored: true
  }
)

// ===========================================================================

module.exports = InvoicePayment
