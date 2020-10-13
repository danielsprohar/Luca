const models = {
  Account: require('./account'),
  CustomerVehicle: require('./customer-vehicle'),
  Customer: require('./customer'),
  Invoice: require('./invoice'),
  ParkingSpace: require('./parking-space'),
  Payment: require('./payment'),
  RentalAgreement: require('./rental-agreement'),
  Role: require('./role'),
  User: require('./user').User
}

// TODO: Create relationships

module.exports = models
