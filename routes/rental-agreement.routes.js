const sequelize = require('../config/database')
const express = require('express')
const router = express.Router()
const debug = require('debug')('luca:rental-agreements')
const { httpStatusCodes } = require('../constants')
const { isAdministrator, isValidParamType } = require('../middleware')
const {
  Customer,
  Invoice,
  ParkingSpace,
  RentalAgreement
} = require('../models')

// ===========================================================================
// Pagination
// ===========================================================================

router.get('/', async (req, res, next) => {
  const pageSize = req.params.pageSize || 30
  const pageIndex = req.params.pageIndex || 1

  try {
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
  } catch (error) {
    next(error)
  }
})

// ===========================================================================
// By ID
// ===========================================================================

router.get('/:id', isValidParamType, async (req, res, next) => {
  try {
    const space = await RentalAgreement.findOne({
      where: {
        id: req.params.id
      },
      include: [Customer, ParkingSpace]
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
  const { error } = RentalAgreement.validateInsert(req.body)
  if (error) {
    debug(error)
    return res.status(httpStatusCodes.badRequest).send(error.details[0].message)
  }

  // Do some more validation.
  const parkingSpaceId = req.body.parkingSpaceId
  const customerId = req.body.customerId
  try {
    if (!(await parkingSpaceExists(parkingSpaceId))) {
      return res
        .status(httpStatusCodes.notFound)
        .send('Parking Space does not exist.')
    }

    if (!(await customerExists(customerId))) {
      return res
        .status(httpStatusCodes.notFound)
        .send('Customer does not exist.')
    }

    // Start the transaction
    const transaction = await sequelize.transaction()

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

    res.status(httpStatusCodes.created).send(agreement)
  } catch (error) {
    debug(error)

    if (transaction) {
      await transaction.rollback()
    }

    next(err)
  }
})

// ===========================================================================
// Update
// ===========================================================================

router.put(
  '/:id',
  [isAdministrator, isValidParamType],
  async (req, res, next) => {
    const { error } = RentalAgreement.validateUpdate(req.body)
    if (error) {
      debug(error)
      return res
        .status(httpStatusCodes.badRequest)
        .send(error.details[0].message)
    }

    try {
      if (!(await rentalAgreementExists(req.params.id))) {
        return res
          .status(httpStatusCodes.notFound)
          .send('Rental Agreement does not exist.')
      }

      await RentalAgreement.update(req.body, {
        where: {
          id: req.params.id
        }
      })

      res.status(httpStatusCodes.notFound).send()
    } catch (error) {
      next(error)
    }
  }
)

// ===========================================================================
// Deactivate
// ===========================================================================

router.put('/:id/deactivate', async (req, res, next) => {
  if (!(await rentalAgreementExists(req.params.id))) {
    return res
      .status(httpStatusCodes.notFound)
      .send('Rental Agreement does not exist.')
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

  res.status(httpStatusCodes.noContent).send()
})

// ===========================================================================
// Get all the invoices that are associated with the given rental agreement
// ===========================================================================
router.get('/:id/invoices', isValidParamType, async (req, res, next) => {
  try {
    if (!(await rentalAgreementExists(req.params.id))) {
      return res
        .status(httpStatusCodes.notFound)
        .send('Rental Agreement does not exist')
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
