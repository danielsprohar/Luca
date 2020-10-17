const express = require('express')
const router = express.Router()
const debug = require('debug')('luca:parking-spaces')
const { Customer, ParkingSpace } = require('../models')
const { httpStatusCodes } = require('../constants')
const { admin, paramValidation } = require('../middleware')

// ===========================================================================
// Pagination
// ===========================================================================

router.get('/', async (req, res, next) => {
  const pageSize = req.params.pageSize || 30
  const pageIndex = req.params.pageIndex || 1

  try {
    const { count, rows: spaces } = await ParkingSpace.findAllAndCount({
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

router.get('/:id', paramValidation, async (req, res, next) => {
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

router.post('/', admin, async (req, res, next) => {
  const { error } = ParkingSpace.validateInsert(req.body)
  if (error) {
    debug(error)
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
router.put('/:id', [admin, paramValidation], async (req, res, next) => {
  const { error } = ParkingSpace.validateUpdate(req.body)
  if (error) {
    debug(error)
    return res.status(httpStatusCodes.badRequest).send(error.details[0].message)
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
})

// ===========================================================================
// Get the Occupants
// ===========================================================================

router.get('/:id/occupants', paramValidation, async (req, res, next) => {
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
