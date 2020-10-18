const express = require('express')
const router = express.Router()
const winston = require('../config/winston')
const { Customer, ParkingSpace } = require('../models')
const { httpStatusCodes } = require('../constants')
const { isAdministrator, isValidParamType } = require('../middleware')

// ===========================================================================
// Pagination
// ===========================================================================

router.get('/', async (req, res, next) => {
  const pageSize = req.params.pageSize || 50
  const pageIndex = req.params.pageIndex || 1

  try {
    const { count, rows: spaces } = await ParkingSpace.findAndCountAll({
      order: ['id'],
      limit: pageSize,
      offset: (pageIndex - 1) * pageSize
    })

    res.json({
      count,
      pageIndex,
      pageSize,
      data: spaces
    })
  } catch (error) {
    next(error)
  }
})

// ===========================================================================
// By ID
// ===========================================================================

router.get('/:id', isValidParamType, async (req, res, next) => {
  try {
    const space = await ParkingSpace.findOne({
      where: {
        id: req.params.id
      }
    })

    if (!space) {
      return res
        .status(httpStatusCodes.notFound)
        .send('Resource does not exist.')
    }

    res.json(space)
  } catch (error) {
    next(error)
  }
})

// ===========================================================================
// Create
// ===========================================================================

router.post('/', isAdministrator, async (req, res, next) => {
  const { error } = ParkingSpace.validateInsert(req.body)
  if (error) {
    winston.warn(error)
    return res.status(httpStatusCodes.notFound).send(error.details[0].message)
  }

  try {
    const space = await ParkingSpace.create(req.body)
    res.status(httpStatusCodes.created).send(space)
  } catch (error) {
    next(error)
  }
})

// ===========================================================================
// Update
// ===========================================================================

router.put(
  '/:id',
  [isAdministrator, isValidParamType],
  async (req, res, next) => {
    const { error } = ParkingSpace.validateUpdate(req.body)
    if (error) {
      winston.warn(error)
      return res
        .status(httpStatusCodes.badRequest)
        .send(error.details[0].message)
    }

    try {
      if (!(await parkingSpaceExists(req.params.id))) {
        return res
          .status(httpStatusCodes.notFound)
          .send('Parking Space does not exist.')
      }

      await ParkingSpace.update(req.body, {
        where: {
          id: req.params.id
        }
      })

      res.status(httpStatusCodes.noContent).send()
    } catch (error) {
      next(error)
    }
  }
)

// ===========================================================================
// Get the Occupants
// ===========================================================================

router.get('/:id/occupants', isValidParamType, async (req, res, next) => {
  try {
    const space = await ParkingSpace.findByPk(req.params.id, {
      include: [
        {
          model: Customer,
          as: 'customers',
          required: true,
          subQuery: true,
          through: {
            attributes: [],
            where: {
              parking_space_id: req.params.id
            }
          }
        }
      ]
    })

    res.json(space.customers)
  } catch (error) {
    next(error)
  }
})

// ===========================================================================
// Facilitators
// ===========================================================================

async function parkingSpaceExists(id) {
  return await ParkingSpace.findByPk(id, {
    attributes: ['id']
  })
}

// ===========================================================================

module.exports = router
