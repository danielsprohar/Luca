const CustomerVehicle = require('./customer-vehicle')
const Customer = require('./customer')
const Invoice = require('./invoice')
const ParkingSpace = require('./parking-space')
const Payment = require('./payment')
const RentalAgreement = require('./rental-agreement')
const Role = require('./role')
const { User } = require('./user')

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

RentalAgreement.belongsTo(ParkingSpace, {
  foreignKey: {
    name: 'parkingSpaceId',
    field: 'parking_space_id'
  }
})

RentalAgreement.belongsTo(Customer, {
  foreignKey: {
    name: 'customerId',
    field: 'customer_id'
  }
})

// ===========================================================================

Invoice.belongsTo(RentalAgreement, {
  foreignKey: {
    name: 'rentalAgreementId',
    field: 'rental_agreement_id'
  }
})

CustomerVehicle.belongsTo(Customer, {
  foreignKey: {
    name: 'customerId',
    field: 'customer_id'
  }
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
