const sequelize = require('../config/database')
const express = require('express')
const router = express.Router()
const debug = require('debug')('luca:invoices')

const {
  Invoice,
  InvoicePayment,
  Payment,
  RentalAgreement
} = require('../models')

// ===========================================================================
// Pagination
// ===========================================================================

router.get('/', async (req, res, next) => {
  const pageSize = req.params.pageSize || 30
  const pageIndex = req.params.pageIndex || 1

  const { count, rows: invoices } = await Invoice.findAllAndCount({
    order: ['id'],
    limit: pageSize,
    offset: (pageIndex - 1) * pageSize
  })

  res.json({
    count,
    pageIndex,
    pageSize,
    data: invoices
  })
})

// ===========================================================================
// By ID
// ===========================================================================

router.get('/:id', async (req, res, next) => {
  const invoice = await Invoice.findByPk(req.params.id)

  res.json(invoice)
})

// ===========================================================================
// Create
// ===========================================================================

router.post('/', async (req, res, next) => {
  const { error } = Invoice.validateInsert(req.body)
  if (error) {
    debug(error)
    return res.status(400).send(error.details[0].message)
  }

  const space = await Invoice.create(req.body)

  res.json(space)
})

// ===========================================================================
// Make a payment
// ===========================================================================

router.post('/:id/make-a-payment', async (req, res, next) => {
  if (!(await invoiceExists(req.params.id))) {
    return res.status(404).send('Invoice does not exist.')
  }

  const { error } = Payment.validateInsert(req.body)
  if (error) {
    debug(error)
    return res.status(400).send(error.details[0].message)
  }

  const invoice = await Invoice.findByPk(req.params.id, {
    include: [
      {
        model: RentalAgreement,
        attributes: ['recurring_rate'],
        as: 'rentalAgreement'
      }
    ]
  })

  return res.json(invoice)

  // Start the transaction
  const transaction = await sequelize.transaction()

  try {
    // Make the payment
    const payment = await Payment.create(req.body)

    // Make the association between the payment and invoice
    await InvoicePayment.create({
      invoiceId: req.params.id,
      paymentId: payment.id
    })

    // update the invoice status

    await transaction.commit()
    res.status(204).send()
  } catch (error) {
    debug(error)
    if (transaction) {
      await transaction.rollback()
    }
    next(error)
  }

  // If we make it this far, then something went wrong.
  res.status(500).send()
})

// ===========================================================================
// Facilitators
// ===========================================================================

async function invoiceExists(id) {
  return await Invoice.findByPk(id, {
    attributes: ['id']
  })
}

// ===========================================================================

module.exports = router
