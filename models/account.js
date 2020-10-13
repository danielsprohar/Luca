const { DataTypes, Model, Deferrable } = require('sequelize')
const sequelize = require('../config/database')

class Account extends Model {}

Account.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrementIdentity: true
    },
    customerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        key: 'id',
        model: 'Customer',
        deferrable: Deferrable.INITIALLY_IMMEDIATE
      }
    }
  },
  {
    sequelize,
    modelName: 'Account',
    tableName: 'accounts',
    underscored: true
  }
)

module.exports = Account
