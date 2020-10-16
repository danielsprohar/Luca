const authRouter = require('./auth.routes')
const customersRouter = require('./customer.routes')
const invoicesRouter = require('./invoice.routes')
const parkingSpacesRouter = require('./parking-space.routes')
const rentalAgreementsRouter = require('./rental-agreement.routes')

module.exports = {
  authRouter,
  customersRouter,
  invoicesRouter,
  parkingSpacesRouter,
  rentalAgreementsRouter
}
