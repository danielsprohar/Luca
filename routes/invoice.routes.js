const sequelize = require('../config/database')
const express = require('express')
const router = express.Router()
const winston = require('../config/winston')
const { httpStatusCodes } = require('../constants')
const { isAdministrator, isValidParamType } = require('../middleware')

const {
  Invoice,
  Payment,
  RentalAgreement
} = require('../models')

// ===========================================================================
// Pagination
// ===========================================================================

router.get('/', async (req, res, next) => {
  const pageIndex = req.query.pageIndex || 1
  const pageSize = req.query.pageSize || 30

  try {
    const { count, rows: invoices } = await Invoice.findAndCountAll({
      order: ['id'],
      limit: pageSize,
      offset: pageIndex * pageSize
    })

    res.json({
      count,
      pageIndex,
      pageSize,
      data: invoices
    })
  } catch (error) {
    next(error)
  }
})

// ===========================================================================
// By ID
// ===========================================================================

router.get('/:id', isValidParamType, async (req, res) => {
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

router.post('/', isAdministrator, async (req, res, next) => {
  const { error } = Invoice.validateInsert(req.body)
  if (error) {
    winston.warn(error)
    return res.status(httpStatusCodes.badRequest).send(error.details[0].message)
  }

  try {
    const space = await Invoice.create(req.body)
    res.status(httpStatusCodes.created).send(space)
  } catch (error) {
    next(error)
  }
})

// ===========================================================================
// Make a payment
// ===========================================================================

router.post(
  '/:id/payments',
  [isAdministrator, isValidParamType],
  async (req, res, next) => {
    const { error } = Payment.validateInsert(req.body)
    if (error) {
      winston.warn(error)
      return res
        .status(httpStatusCodes.badRequest)
        .send(error.details[0].message)
    }

    const invoiceId = req.params.id
    const invoice = await Invoice.findByPk(invoiceId, {
      include: [
        {
          model: RentalAgreement,
          as: 'rentalAgreement',
          attributes: [['recurring_rate', 'recurringRate']]
        }
      ]
    })

    if (!invoice) {
      return res
        .status(httpStatusCodes.notFound)
        .send('Invoice does not exist.')
    }

    const payments = await Payment.findAll({
      include: [
        {
          model: Invoice,
          as: 'invoices',
          attributes: [],
          through: {
            where: {
              invoice_id: invoiceId
            },
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
      await invoice.addPayment(payment)

      // update the invoice status
      const amountDue = calcInvoiceBalance(invoice, payments)

      if (payment.amount >= amountDue) {
        invoice.invoiceStatus = 'paid'
      } else {
        invoice.invoiceStatus = 'partially paid'
      }

      await invoice.save()
      await transaction.commit()

      return res.status(httpStatusCodes.created).send(payment)
    } catch (error) {
      winston.error(error)

      if (transaction) {
        await transaction.rollback()
      }

      next(error)
    }
  }
)

// ===========================================================================
// Facilitators
// ===========================================================================

/**
 * Calculates the remaining balance on the Invoice provided.
 * @param {Invoice} invoice
 * @param {Payment[]} payments
 *
 * @returns {number} the total amount left to pay on the given Invoice.
 */
function calcInvoiceBalance(invoice, payments) {
  if (payments.length === 0) {
    return invoice.rentalAgreement.recurringRate
  }

  const paymentAmounts = payments.map((p) => Number.parseFloat(p.amount))
  const totalPaid = paymentAmounts.reduce(
    (previousValue, currentValue) => previousValue + currentValue
  )

  return invoice.rentalAgreement.recurringRate - totalPaid
}

// ===========================================================================

module.exports = router
