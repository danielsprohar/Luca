const express = require('express')
const helmet = require('helmet')
const morgan = require('morgan')
const routers = require('./routes')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const middleware = require('./middleware')
const app = express()

// ===========================================================================
// Logging
// ===========================================================================

// Catch rejected promises
process.on('unhandledRejection', (err) => {
  // Let winston take care of the rest
  throw err
})

// ===========================================================================
// Middleware
// ===========================================================================

app.use(
  cors({
    origin: 'http://localhost:4200',
    allowedHeaders: 'GET,HEAD,PUT,POST,Content-Type,Authorization'
  })
)

app.use(express.json())
app.use(helmet())
app.use(morgan('dev'))

// ===========================================================================
// Routes
// ===========================================================================

app.use('/api/auth', routers.authRouter)
app.use(middleware.isAuthenticated)

app.use('/api/customers', routers.customersRouter)
app.use('/api/invoices', routers.invoicesRouter)
app.use('/api/parking-spaces', routers.parkingSpacesRouter)
app.use('/api/rental-agreements', routers.rentalAgreementsRouter)

app.use(middleware.errorHandler)

// ===========================================================================

module.exports = app
