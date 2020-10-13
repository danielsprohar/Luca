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
      values: ['not paid', 'paid', 'bad credit']
    },
    rentalAgreementId: {
      type: DataTypes.INTEGER,
      allowNull: false,
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
    underscored: true
  }
)

// TODO: Create relationships

Invoice.sync()
module.exports = Invoice
