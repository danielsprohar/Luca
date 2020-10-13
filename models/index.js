const CustomerVehicle = require('./customer-vehicle')
const Customer = require('./customer')
const Invoice = require('./invoice')
const ParkingSpace = require('./parking-space')
const Payment = require('./payment')
const RentalAgreement = require('./rental-agreement')
const Role = require('./role')
const User = require('./user').User

// ===========================================================================
// Many-to-Many
// ===========================================================================

User.belongsToMany(Role, { through: 'user_roles' })
User.belongsToMany(Role, { through: 'user_roles' })

Customer.belongsToMany(ParkingSpace, { through: 'parking_space_occupants' })
ParkingSpace.belongsToMany(Customer, { through: 'parking_space_occupants' })

Invoice.belongsToMany(Payment, { through: 'invoice_payments' })
Payment.belongsToMany(Invoice, { through: 'invoice_payments' })

// ===========================================================================
// One-to-Many
// ===========================================================================
RentalAgreement.belongsTo(ParkingSpace)
RentalAgreement.belongsTo(Customer)

Invoice.belongsTo(RentalAgreement)

CustomerVehicle.belongsTo(Customer)


// ===========================================================================

const models = {
  CustomerVehicle,
  Customer,
  Invoice,
  ParkingSpace,
  Payment,
  RentalAgreement,
  Role,
  User
}

module.exports = models
