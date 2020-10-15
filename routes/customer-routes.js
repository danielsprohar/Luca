const express = require('express')
const router = express.Router()
const debug = require('debug')('luca:customers')

const { Customer, CustomerVehicle, RentalAgreement } = require('../models')

// ===========================================================================
// Pagination
// ===========================================================================

router.get('/', async (req, res, next) => {
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

router.get('/:id', async (req, res, next) => {
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

router.post('/', async (req, res, next) => {
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
router.put('/:id', async (req, res, next) => {
  const { error } = Customer.prototype.validateUpdate(req.body)
  if (error) {
    debug(error)
    return res.status(400).send(error.details[0].message)
  }

  // TODO: Implement this.

  res.json(space)
})

// ===========================================================================
// Associated resources
// ===========================================================================

router.get('/:id/rental-agreements', async (req, res, next) => {
  const agreements = await RentalAgreement.findAll({
    where: {
      customerId: req.params.id
    },
    include: [
      {
        model: Customer,
        attributes: [],
        required: true
      }
    ]
  })

  res.json(agreements)
})

// ===========================================================================

module.exports = router
