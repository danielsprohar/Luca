const { DataTypes, Model, Deferrable } = require('sequelize')
const sequelize = require('../config/database')

class RentalAgreement extends Model {}

RentalAgreement.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrementIdentity: true
    },
    recurringDueDate: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'recurring_due_date',
      validate: {
        min: 1,
        max: 31
      }
    },
    recurringRate: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      field: 'recurring_rate',
      validate: {
        min: 0
      }
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      field: 'is_active',
      defaultValue: true
    },
    agreementType: {
      type: DataTypes.ENUM,
      field: 'agreement_type',
      allowNull: false,
      values: ['daily', 'weekly', 'monthly']
    },
    customerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        key: 'id',
        model: 'Customer',
        deferrable: Deferrable.INITIALLY_IMMEDIATE
      }
    },
    parkingSpaceId: {
      type: DataTypes.INTEGER,
      allowNull: false,
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
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
)

RentalAgreement.sync()
module.export = RentalAgreement
