const request = require('supertest')
const app = require('../../app')
const { httpStatusCodes } = require('../../constants')

// ===========================================================================
// TEST: Get a paginated list of Customers
// ===========================================================================

describe(`Test 'Get All Customers' endpoint`, () => {
  it(`Should return '200 OK'.`, (done) => {
    request(app)
      .get('/api/customers')
      .then((res) => {
        expect(res).toBeDefined()
        expect(res.status).toBe(httpStatusCodes.ok)
        expect(res.body.count).toBeGreaterThan(0)
      })
      .catch((err) => done(err))
      .finally(() => done())
  })
})

// ===========================================================================
// TEST: Get a Customer by ID
// ===========================================================================

describe(`Test 'Get a Customer by ID' endpoint`, () => {
  it(`Should return '200 OK'.`, (done) => {
    request(app)
      .get('/api/customers/1')
      .then((res) => {
        expect(res.body.id).toBe(1)
      })
      .catch((err) => done(err))
      .finally(() => done())
  })

  it(`Should return '404 NOT FOUND'.`, (done) => {
    request(app)
      .get('/api/customers/100000')
      .then((res) => {
        expect(res.status).toBe(httpStatusCodes.notFound)
      })
      .catch((err) => done(err))
      .finally(() => done())
  })
})

// ===========================================================================
// TEST: Create a Customer
// ===========================================================================

describe(`Test 'Create a Customer' endpoint`, () => {
  it(`Should return '403 FORBIDDEN'.`, (done) => {
    request(app)
      .post('/api/customers')
      .then((res) => {
        expect(res.status).toBe(httpStatusCodes.forbidden)
      })
      .catch((err) => done(err))
      .finally(() => done())
  })
})

// ===========================================================================
// TEST: Update a Customer
// ===========================================================================

describe(`Test 'Update a Customer' endpoint`, () => {
  it(`Should return '403 FORBIDDEN' because we are not logged in as an admin.`, (done) => {
    request(app)
      .put('/api/customers/1')
      .then((res) => {
        expect(res.status).toBe(httpStatusCodes.forbidden)
      })
      .catch((err) => done(err))
      .finally(() => done())
  })

  it(`Should return '400 BAD REQUEST' because the 'id' param is of type 'string'.`, (done) => {
    request(app)
      .put('/api/customers/im_a_string')
      .then((res) => {
        expect(res.status).toBe(httpStatusCodes.forbidden)
      })
      .catch((err) => done(err))
      .finally(() => done())
  })
})
