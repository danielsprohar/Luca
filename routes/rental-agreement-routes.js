const models = require('../models')
const express = require('express')
const router = express.Router()

// ===========================================================================
// Pagination
// ===========================================================================

router.get('/', async (req, res) => {
  const RentalAgreement = models.RentalAgreement
  const pageSize = req.params.pageSize || 30
  const pageIndex = req.params.pageIndex || 1

  const { count, rows: agreements } = await RentalAgreement.findAndCountAll({
    order: ['id'],
    limit: pageSize,
    offset: (pageIndex - 1) * pageSize
  })

  // TODO: Add a PaginatedResponse wrapper class

  res.json({
    count,
    pageIndex,
    pageSize,
    data: agreements
  })
})

// ===========================================================================
// By ID
// ===========================================================================

router.get('/:id', async (req, res) => {
  const RentalAgreement = models.RentalAgreement

  const space = await RentalAgreement.findOne({
    where: {
      id: req.params.id
    },
    include: [models.Customer, models.ParkingSpace]
  })

  if (!space) {
    return res.status(404).send('Resource does not exist.')
  }

  res.json(space)
})

// ===========================================================================

module.exports = router
