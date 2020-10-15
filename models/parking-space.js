const { DataTypes, Model } = require('sequelize')
const sequelize = require('../config/database')
const Joi = require('joi')

// ===========================================================================

class ParkingSpace extends Model {
  /**
   * Ensure that `req.body` has the required fields to create a new tuple.
   * @param {*} space
   */
  validateInsert(space) {
    const schema = Joi.object({
      name: Joi.string().min(1).max(32).required(),
      description: Joi.string().min(1).max(128).required(),
      isOccupied: Joi.boolean(),
      amperageCapacity: Joi.number(),
      spaceType: Joi.string()
    })

    return schema.validate(space)
  }

  /**
   * Ensure that the `req.body` has the required fields to update an existing tuple.
   * @param {*} space
   */
  validateUpdate(space) {
    const schema = Joi.object({
      name: Joi.string().min(1).max(32),
      description: Joi.string().min(1).max(128),
      isOccupied: Joi.boolean(),
      amperageCapacity: Joi.number(),
      spaceType: Joi.string()
    })

    return schema.validate(space)
  }
}

// ===========================================================================

ParkingSpace.init(
  {
    name: {
      type: DataTypes.STRING(32),
      allowNull: false,
      unique: true
    },
    description: {
      type: DataTypes.STRING(128)
    },
    isOccupied: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    amperageCapacity: {
      type: DataTypes.INTEGER
    },
    spaceType: {
      type: DataTypes.ENUM,
      allowNull: false,
      values: ['rv', 'mobile home', 'storage']
    }
  },
  {
    sequelize,
    modelName: 'ParkingSpace',
    tableName: 'parking_spaces',
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
)

// ===========================================================================

module.exports = ParkingSpace
