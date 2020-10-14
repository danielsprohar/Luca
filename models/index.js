const CustomerVehicle = require('./customer-vehicle')
const Customer = require('./customer')
const Invoice = require('./invoice')
const { ParkingSpace } = require('./parking-space')
const Payment = require('./payment')
const RentalAgreement = require('./rental-agreement')
const Role = require('./role')
const { User } = require('./user')

// ===========================================================================
// Many-to-Many
// ===========================================================================

User.belongsToMany(Role, {
  through: 'user_roles',
  foreignKey: {
    name: 'roleId',
    field: 'role_id'
  }
})

Role.belongsToMany(User, {
  through: 'user_roles',
  foreignKey: {
    name: 'userId',
    field: 'user_id'
  }
})

// ===========================================================================

Customer.belongsToMany(ParkingSpace, {
  through: 'parking_space_occupants',
  foreignKey: {
    name: 'parkingSpaceId',
    field: 'parking_space_id'
  }
})

ParkingSpace.belongsToMany(Customer, {
  through: 'parking_space_occupants',
  foreignKey: {
    name: 'customerId',
    field: 'customer_id'
  }
})

// ===========================================================================

Invoice.belongsToMany(Payment, {
  through: 'invoice_payments',
  foreignKey: {
    name: 'paymentId',
    field: 'payment_id'
  }
})

Payment.belongsToMany(Invoice, {
  through: 'invoice_payments',
  foreignKey: {
    name: 'invoiceId',
    field: 'invoice_id'
  }
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
