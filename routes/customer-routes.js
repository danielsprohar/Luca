const express = require('express')
const router = express.Router()
const { Customer, CustomerVehicle } = require('../models')

// ===========================================================================
// Pagination
// ===========================================================================

router.get('/', async (req, res) => {
  const pageSize = req.params.pageSize || 30
  const pageIndex = req.params.pageIndex || 1

  const { count, rows: customers } = await Customer.findAllAndCount({
    order: ['id'],
    limit: pageSize,
    offset: (pageIndex - 1) * pageSize
  })

  res.json({
    count,
    pageIndex,
    pageSize,
    data: customers
  })
})

// ===========================================================================
// By ID
// ===========================================================================

router.get('/:id', async (req, res) => {
  const customer = await Customer.findOne({
    where: {
      id: req.params.id
    },
    include: [CustomerVehicle]
  })

  if (!customer) {
    return res.status(404).send('Resource does not exist.')
  }

  res.json(customer)
})

// ===========================================================================
// Create
// ===========================================================================

router.post('/', async (req, res) => {
  const { error } = Customer.validateInsert(req.body)
  if (error) {
    debug(error)
    return res.status(400).send(error.details[0].message)
  }

  const space = await Customer.create(req.body)

  res.json(space)
})

// ===========================================================================
// Update
// ===========================================================================
router.put('/', async (req, res) => {
  const { error } = Customer.prototype.validateUpdate(req.body)
  if (error) {
    debug(error)
    return res.status(400).send(error.details[0].message)
  }

  const space = await Customer.create(req.body, {
    isNewRecord: false
  })

  res.json(space)
})

// ===========================================================================

module.exports = router
