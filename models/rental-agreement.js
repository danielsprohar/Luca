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
      validate: {
        min: 1,
        max: 31
      }
    },
    recurringRate: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      validate: {
        min: 0
      }
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    agreementType: {
      type: DataTypes.ENUM,
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
    underscored: true
  }
)

module.export = RentalAgreement
