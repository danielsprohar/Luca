const { DataTypes, Model } = require('sequelize')
const sequelize = require('../config/database')

class Payment extends Model {}

Payment.init(
  {
    id: {
      type: DataTypes.NUMBER,
      primaryKey: true,
      autoIncrementIdentity: true
    },
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
    modelName: 'Payment'
  }
)

Payment.sync()
module.exports = Payment
