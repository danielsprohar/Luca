const express = require('express')
const helmet = require('helmet')
const morgan = require('morgan')
const routers = require('./routes')
// const cors = require('cors')
const debug = require('debug')('luca:app')
const winston = require('./config/winston')
const middleware = require('./middleware')
const app = express()

const HOST = process.env.HOST || 'localhost'
const PORT = process.env.PORT || 5000

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

// app.use(cors({

// }))

app.use(express.json())
app.use(helmet())
app.use(morgan('dev'))

// ===========================================================================
// Routes
// ===========================================================================

app.use('/api/auth', routers.authRouter)
// app.use(middleware.auth)

app.use('/api/customers', routers.customersRouter)
app.use('/api/invoices', routers.invoicesRouter)
app.use('/api/parking-spaces', routers.parkingSpacesRouter)
app.use('/api/rental-agreements', routers.rentalAgreementsRouter)

app.use(middleware.errorHandler)

// ===========================================================================

app.listen(PORT, winston.info(`Listening  http://${HOST}::${PORT}`))
