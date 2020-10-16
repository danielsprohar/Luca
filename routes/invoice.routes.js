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
  // Some validation
  if (!(await invoiceExists(req.params.id))) {
    return res.status(404).send('Invoice does not exist.')
  }

  const { error } = Payment.validateInsert(req.body)
  if (error) {
    debug(error)
    return res.status(400).send(error.details[0].message)
  }

  // Fetch the resource
  const invoice = await Invoice.findByPk(req.params.id, {
    include: [
      {
        model: RentalAgreement,
        attributes: [['recurring_rate', 'recurringRate']],
        as: 'rentalAgreement'
      },
      {
        model: Payment,
        as: 'payments',
        attributes: ['amount'],
        // This prevents Sequelize from fetching the Junction table.
        through: {
          attributes: []
        }
      }
    ]
  })

  // Start the transaction
  const transaction = await sequelize.transaction()

  try {
    // Make the payment
    const payment = await Payment.create(req.body)

    // Make the association between the payment and invoice
    const invoicePayment = await InvoicePayment.create({
      invoice_id: invoice.id,
      payment_id: payment.id
    })

    // update the invoice status
    const amountDue = getAmountDue()

    if (payment.amount >= amountDue) {
      invoice.invoiceStatus = 'paid'
    } else {
      invoice.invoiceStatus = 'partially paid'
    }

    // Save changes
    await transaction.commit()

    res.json(payment)
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
// Facilitators
// ===========================================================================

async function invoiceExists(id) {
  return await Invoice.findByPk(id, {
    attributes: ['id']
  })
}

// ===========================================================================

/**
 * Calculates the amount that is due on the invoice.
 * @param {Invoice} invoice
 */
function getAmountDue(invoice) {
  const paymentAmounts = invoice.payments.map((p) =>
    Number.parseFloat(p.amount)
  )
  const totalPaid = paymentAmounts.reduce(
    (previousValue, currentValue) => previousValue + currentValue
  )

  return invoice.rentalAgreement.recurringRate - totalPaid
}

// ===========================================================================

module.exports = router
