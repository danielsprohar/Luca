const CustomerVehicle = require('./customer-vehicle')
const Customer = require('./customer')
const Invoice = require('./invoice')
const InvoicePayment = require('./invoice-payment')
const ParkingSpace = require('./parking-space')
const Payment = require('./payment')
const RentalAgreement = require('./rental-agreement')
const Role = require('./role')
const User = require('./user')
const UserRole = require('./user-role')

// ===========================================================================
// Many-to-Many
// ===========================================================================

User.belongsToMany(Role, {
  through: UserRole,
  timestamps: true,
  as: 'roles',
  foreignKey: {
    name: 'userId',
    field: 'user_id'
  }
})

Role.belongsToMany(User, {
  through: UserRole,
  timestamps: true,
  as: 'users',
  foreignKey: {
    name: 'roleId',
    field: 'role_id'
  }
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
  through: InvoicePayment,
  as: 'payments',
  foreignKey: 'invoice_id'
})

Payment.belongsToMany(Invoice, {
  through: InvoicePayment,
  as: 'invoices',
  foreignKey: 'payment_id'
})

// ===========================================================================
// One-to-Many
// ===========================================================================

ParkingSpace.hasMany(RentalAgreement, {
  foreignKey: {
    field: 'parking_space_id',
    name: 'parkingSpaceId'
  }
})

RentalAgreement.belongsTo(ParkingSpace, {
  foreignKey: {
    field: 'parking_space_id',
    name: 'parkingSpaceId'
  }
})

// ===========================================================================

Customer.hasMany(RentalAgreement, {
  foreignKey: {
    field: 'customer_id',
    name: 'customerId'
  }
})

RentalAgreement.belongsTo(Customer, {
  foreignKey: {
    field: 'customer_id',
    name: 'customerId'
  }
})

// ===========================================================================
// One-to-Many
// ===========================================================================

RentalAgreement.hasMany(Invoice, {
  foreignKey: {
    field: 'rental_agreement_id',
    name: 'rentalAgreementId'
  }
})

Invoice.belongsTo(RentalAgreement, {
  foreignKey: {
    field: 'rental_agreement_id',
    name: 'rentalAgreementId'
  },
  as: 'rentalAgreement'
})

// ===========================================================================

Customer.hasMany(CustomerVehicle, {
  as: 'vehicles',
  foreignKey: {
    field: 'customer_id',
    name: 'customerId'
  }
})

CustomerVehicle.belongsTo(Customer, {
  foreignKey: {
    field: 'customer_id',
    name: 'customerId'
  }
})

// ===========================================================================

const models = {
  CustomerVehicle,
  Customer,
  Invoice,
  InvoicePayment,
  ParkingSpace,
  Payment,
  RentalAgreement,
  Role,
  User,
  UserRole
}

module.exports = models
