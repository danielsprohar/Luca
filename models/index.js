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
  as: 'roles',
  foreignKey: {
    name: 'userId',
    field: 'user_id'
  }
})

Role.belongsToMany(User, {
  through: 'user_roles',
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
  foreignKey: {
    field: 'customer_id',
    name: 'customerId'
  }
})

ParkingSpace.belongsToMany(Customer, {
  through: 'occupants',
  as: 'customers',
  foreignKey: {
    field: 'parking_space_id',
    name: 'parkingSpaceId'
  }
})

// ===========================================================================
// Many-to-Many
// ===========================================================================

Invoice.belongsToMany(Payment, {
  through: 'invoice_payments',
  as: 'payments',
  foreignKey: {
    field: 'invoice_id',
    name: 'invoiceId'
  }
})

Payment.belongsToMany(Invoice, {
  through: 'invoice_payments',
  as: 'invoices',
  foreignKey: {
    field: 'payment_id',
    name: 'paymentId'
  }
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

Customer.hasMany(Payment, {
  as: 'payments',
  foreignKey: {
    field: 'customer_id',
    name: 'customerId'
  }
})

Payment.belongsTo(Customer, {
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
  ParkingSpace,
  Payment,
  RentalAgreement,
  Role,
  User
}

module.exports = models
