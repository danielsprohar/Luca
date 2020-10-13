const express = require('express')
const router = express.Router()
const models = require('../models')

// ===========================================================================
// Pagination
// ===========================================================================

router.get('/', async (req, res) => {
  const ParkingSpace = models.ParkingSpace
  const pageSize = req.params.pageSize || 30
  const pageIndex = req.params.pageIndex || 1

  const spaces = await ParkingSpace.findAll({
    order: ['id'],
    limit: pageSize,
    offset: (pageIndex - 1) * pageSize
  })

  res.json(spaces)
})

// ===========================================================================
// By ID
// ===========================================================================

router.get('/:spaceId', async (req, res) => {
  const ParkingSpace = models.ParkingSpace

  const space = await ParkingSpace.findOne({
    where: {
      id: req.params.spaceId
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

// ===========================================================================
// Update
// ===========================================================================

// ===========================================================================

module.exports = router
