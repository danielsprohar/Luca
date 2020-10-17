const sequelize = require('../config/database')
const express = require('express')
const router = express.Router()
const debug = require('debug')('luca:invoices')
const { httpStatusCodes } = require('../constants')

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
  const invoice = await Invoice.findByPk(req.params.id, {
    include: [
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

  res.json(invoice)
})

// ===========================================================================
// Create an invoice
// ===========================================================================

router.post('/', async (req, res, next) => {
  if (!req.user.isAdmin) {
    return res.status(httpStatusCodes.unauthorized).send()
  }

  const { error } = Invoice.validateInsert(req.body)
  if (error) {
    debug(error)
    return res.status(httpStatusCodes.badRequest).send(error.details[0].message)
  }

  const space = await Invoice.create(req.body)

  res.status(httpStatusCodes.created).send(space)
})

// ===========================================================================
// Make a payment
// ===========================================================================

router.post('/:id/make-a-payment', async (req, res, next) => {
  if (!req.user.isAdmin) {
    return res.status(httpStatusCodes.unauthorized).send()
  }

  // Some validation
  if (!(await invoiceExists(req.params.id))) {
    return res.status(httpStatusCodes.notFound).send('Invoice does not exist.')
  }

  const { error } = Payment.validateInsert(req.body)
  if (error) {
    debug(error)
    return res.status(httpStatusCodes.badRequest).send(error.details[0].message)
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

  // =========================================================================
  // Start the transaction
  // =========================================================================
  const transaction = await sequelize.transaction()

  try {
    // Make the payment
    const payment = await Payment.create(req.body)

    // Make the association between the payment and invoice
    await InvoicePayment.create({
      invoice_id: invoice.id,
      payment_id: payment.id
    })

    // update the invoice status
    const amountDue = getAmountDue(invoice)

    if (payment.amount >= amountDue) {
      invoice.invoiceStatus = 'paid'
    } else {
      invoice.invoiceStatus = 'partially paid'
    }

    await invoice.save()

    // Save changes
    await transaction.commit()

    return res.status(httpStatusCodes.created).send(payment)
  } catch (error) {
    debug(error)

    if (transaction) {
      await transaction.rollback()
    }
  }

  // If we make it this far, then something went wrong.
  res.status(httpStatusCodes.internalServerError).send()
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
  if (invoice.payments.length === 0) {
    return invoice.rentalAgreement.recurringRate
  }

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
