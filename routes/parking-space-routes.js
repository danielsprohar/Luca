const express = require('express')
const router = express.Router()
const { ParkingSpace } = require('../models')

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

router.get('/:spaceId', async (req, res) => {
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

router.post('/', async (req, res) => {
  const { error } = ParkingSpace.prototype.validateInsert(req.body)
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
router.put('/', async (req, res) => {
  const { error } = ParkingSpace.prototype.validateUpdate(req.body)
  if (error) {
    debug(error)
    return res.status(400).send(error.details[0].message)
  }

  const space = await ParkingSpace.create(req.body, {
    isNewRecord: false
  })

  res.json(space)
})

// ===========================================================================

module.exports = router
