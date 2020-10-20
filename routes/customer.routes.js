const express = require('express')
const router = express.Router()
const debug = require('debug')('luca:customers')
const { httpStatusCodes } = require('../constants')
const { Customer, CustomerVehicle, RentalAgreement } = require('../models')
const { isAdministrator, isValidParamType } = require('../middleware')

// ===========================================================================
// Pagination
// ===========================================================================

router.get('/', async (req, res, next) => {
  const pageIndex = req.query.pageIndex || 1
  const pageSize = req.query.pageSize || 30

  try {
    const { count, rows: customers } = await Customer.findAndCountAll({
      order: ['id'],
      limit: pageSize,
      offset: pageIndex * pageSize
    })

    res.json({
      count,
      pageIndex,
      pageSize,
      data: customers
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
    const customer = await Customer.findOne({
      where: {
        id: req.params.id
      },
      include: [
        {
          model: CustomerVehicle,
          as: 'vehicles'
        }
      ]
    })

    if (!customer) {
      return res
        .status(httpStatusCodes.notFound)
        .send('Resource does not exist.')
    }

    res.json(customer)
  } catch (error) {
    next(error)
  }
})

// ===========================================================================
// Create
// ===========================================================================

router.post('/', isAdministrator, async (req, res, next) => {
  const { error } = Customer.validateInsert(req.body)
  if (error) {
    debug(error)
    return res.status(httpStatusCodes.badRequest).send(error.details[0].message)
  }

  try {
    const space = await Customer.create(req.body)
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
    try {
      const { error } = Customer.validateUpdate(req.body)
      if (error) {
        debug(error)
        return res
          .status(httpStatusCodes.badRequest)
          .send(error.details[0].message)
      }

      if (!(await customerExists(req.params.id))) {
        return res
          .status(httpStatusCodes.notFound)
          .send('Customer does not exist.')
      }

      await Customer.update(req.body, {
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
// Get a customer's rental agreements
// ===========================================================================

router.get(
  '/:id/rental-agreements',
  isValidParamType,
  async (req, res, next) => {
    try {
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
    } catch (error) {
      next(error)
    }
  }
)

// ===========================================================================
// Facilitators
// ===========================================================================

async function customerExists(id) {
  return await Customer.findByPk(id, {
    attributes: ['id']
  })
}

// ===========================================================================

module.exports = router
