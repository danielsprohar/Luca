const parkingSpacesRouter = require('./parking-space-routes')
const rentalAgreementsRouter = require('./rental-agreement-routes')

module.exports = {
  parkingSpaces: parkingSpacesRouter,
  rentalAgreements: rentalAgreementsRouter
}
