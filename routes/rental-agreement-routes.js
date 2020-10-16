const sequelize = require('../config/database')
const express = require('express')
const router = express.Router()
const debug = require('debug')('luca:rental-agreements')
const {
  Customer,
  Invoice,
  ParkingSpace,
  RentalAgreement
} = require('../models')

// ===========================================================================
// Pagination
// ===========================================================================

router.get('/', async (req, res) => {
  const pageSize = req.params.pageSize || 30
  const pageIndex = req.params.pageIndex || 1

  const { count, rows: agreements } = await RentalAgreement.findAndCountAll({
    order: ['id'],
    limit: pageSize,
    offset: (pageIndex - 1) * pageSize
  })

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
  const space = await RentalAgreement.findOne({
    where: {
      id: req.params.id
    },
    include: [Customer, ParkingSpace]
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
  const { error } = RentalAgreement.validateInsert(req.body)
  if (error) {
    debug(error)
    return res.status(400).send(error.details[0].message)
  }

  // Do some more validation.
  const parkingSpaceId = req.body.parkingSpaceId
  const customerId = req.body.customerId

  if (!(await parkingSpaceExists(parkingSpaceId))) {
    return res.status(404).send('Parking Space does not exist.')
  }

  if (!(await customerExists(customerId))) {
    return res.status(404).send('Customer does not exist.')
  }

  const transaction = await sequelize.transaction()

  try {
    // Now, do work.
    const agreement = await RentalAgreement.create(req.body)

    await ParkingSpace.update(
      { isOccupied: true },
      {
        where: {
          id: parkingSpaceId
        }
      }
    )

    await transaction.commit()

    return res.send(agreement)
  } catch (error) {
    debug(error)

    if (transaction) {
      await transaction.rollback()
    }
  }

  // If we make it this far, then something went wrong.
  res.status(500).send()
})

// ===========================================================================
// Update
// ===========================================================================

router.put('/:id', async (req, res) => {
  const { error } = RentalAgreement.validateUpdate(req.body)
  if (error) {
    debug(error)
    return res.status(400).send(error.details[0].message)
  }

  if (!(await rentalAgreementExists(req.params.id))) {
    return res.status(404).send('Rental Agreement does not exist.')
  }

  await RentalAgreement.update(req.body, {
    where: {
      id: req.params.id
    }
  })

  res.status(204).send()
})

// ===========================================================================
// Deactivate
// ===========================================================================

router.put('/:id/deactivate', async (req, res) => {
  if (!(await rentalAgreementExists(req.params.id))) {
    return res.status(404).send('Rental Agreement does not exist.')
  }

  await RentalAgreement.update(
    {
      isActive: false
    },
    {
      where: {
        id: req.params.id
      }
    }
  )

  res.status(204).send()
})

// ===========================================================================
// Get all the invoices that are associated with the given rental agreement
// ===========================================================================
router.get('/:id/invoices', async (req, res, next) => {
  if (!(await rentalAgreementExists(req.params.id))) {
    return res.status(404).send('Rental Agreement does not exist')
  }

  const pageSize = req.params.pageSize || 30
  const pageIndex = req.params.pageIndex || 1
  const predicate = { rentalAgreementId: req.params.id }

  if (req.query.isPaid !== undefined) {
    predicate.invoiceStatus = Number.parseInt(req.query.isPaid)
      ? 'paid'
      : 'not paid'
  } else if (req.query.badCredit !== undefined && req.query.badCredit) {
    predicate.invoiceStatus = 'bad credit'
  }

  const { count, rows: invoices } = await Invoice.findAndCountAll({
    where: predicate,
    order: ['id'],
    limit: pageSize,
    offset: (pageIndex - 1) * pageSize
  })

  res.json({
    pageIndex,
    pageSize,
    count,
    data: invoices
  })
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

async function customerExists(id) {
  return await Customer.findByPk(id, {
    attributes: ['id']
  })
}

// ===========================================================================

async function rentalAgreementExists(id) {
  return await RentalAgreement.findByPk(id, {
    attributes: ['id']
  })
}

// ===========================================================================

module.exports = router
