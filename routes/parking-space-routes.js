const express = require('express')
const router = express.Router()
const debug = require('debug')('luca:parking-spaces')
const { Customer, ParkingSpace, Occupant } = require('../models')

// ===========================================================================
// Pagination
// ===========================================================================

router.get('/', async (req, res) => {
  const pageSize = req.params.pageSize || 30
  const pageIndex = req.params.pageIndex || 1

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
})

// ===========================================================================
// By ID
// ===========================================================================

router.get('/:id', async (req, res) => {
  const space = await ParkingSpace.findOne({
    where: {
      id: req.params.id
    }
  })

  if (!space) {
    return res.status(404).send('Resource does not exist.')
  }

  res.json(space)
})

// ===========================================================================
// Create
// ===========================================================================

router.post('/', async (req, res) => {
  const { error } = ParkingSpace.validateInsert(req.body)
  if (error) {
    debug(error)
    return res.status(400).send(error.details[0].message)
  }

  const space = await ParkingSpace.create(req.body)

  res.json(space)
})

// ===========================================================================
// Update
// ===========================================================================
router.put('/:id', async (req, res) => {
  const { error } = ParkingSpace.validateUpdate(req.body)
  if (error) {
    debug(error)
    return res.status(400).send(error.details[0].message)
  }

  if (!(await parkingSpaceExists(req.params.id))) {
    return res.status(404).send('Parking Space does not exist.')
  }

  await ParkingSpace.update(req.body, {
    where: {
      id: req.params.id
    }
  })

  res.status(204).send()
})

// ===========================================================================
// Get the Occupants
// ===========================================================================

router.get('/:id/occupants', async (req, res, next) => {
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
