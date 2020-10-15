const CustomerVehicle = require('./customer-vehicle')
const Customer = require('./customer')
const Invoice = require('./invoice')
const ParkingSpace = require('./parking-space')
const Payment = require('./payment')
const RentalAgreement = require('./rental-agreement')
const Role = require('./role')
const User = require('./user')

// ===========================================================================
// Many-to-Many
// ===========================================================================

User.belongsToMany(Role, {
  through: 'user_roles',
  timestamps: true,
  foreignKey: 'user_id'
})

Role.belongsToMany(User, {
  through: 'user_roles',
  timestamps: true,
  foreignKey: 'role_id'
})

// ===========================================================================
// Many-to-Many
// ===========================================================================

Customer.belongsToMany(ParkingSpace, {
  through: 'occupants',
  as: 'parking_spaces',
  foreignKey: 'customer_id'
})

ParkingSpace.belongsToMany(Customer, {
  through: 'occupants',
  as: 'customers',
  foreignKey: 'parking_space_id'
})

// ===========================================================================
// Many-to-Many
// ===========================================================================

Invoice.belongsToMany(Payment, {
  through: 'invoice_payments',
  as: 'payments',
  foreignKey: 'invoice_id'
})

Payment.belongsToMany(Invoice, {
  through: 'invoice_payments',
  as: 'invoices',
  foreignKey: 'payment_id'
})

// ===========================================================================
// One-to-Many
// ===========================================================================

ParkingSpace.hasMany(RentalAgreement)
RentalAgreement.belongsTo(ParkingSpace, {
  foreignKey: 'parking_space_id'
})

Customer.hasMany(RentalAgreement)
RentalAgreement.belongsTo(Customer, {
  foreignKey: 'customer_id'
})

// ===========================================================================
// One-to-Many
// ===========================================================================

RentalAgreement.hasMany(Invoice)
Invoice.belongsTo(RentalAgreement, {
  foreignKey: 'rental_agreement_id'
})

Customer.hasMany(CustomerVehicle)
CustomerVehicle.belongsTo(Customer, {
  foreignKey: 'customer_id'
})

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
