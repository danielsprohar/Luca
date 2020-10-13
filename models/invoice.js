const { DataTypes, Model, Deferrable } = require('sequelize')
const sequelize = require('../config/database')

class Invoice extends Model {}

Invoice.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrementIdentity: true
    },
    paymentStatus: {
      type: DataTypes.ENUM,
      allowNull: false,
      field: 'payment_status',
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
      allowNull: false,
      field: 'payment_due_date'
    },
    billingPeriodStart: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: 'billing_period_start'
    },
    billingPeriodEnd: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: 'billing_period_end'
    }
  },
  {
    sequelize,
    modelName: 'Invoice'
  }
)

// TODO: Create relationships

Invoice.sync()
module.exports = Invoice
