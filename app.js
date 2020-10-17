const express = require('express')
const helmet = require('helmet')
const logger = require('morgan')
const routers = require('./routes')
// const cors = require('cors')
const debug = require('debug')('luca:app')
const middleware = require('./middleware')
const HOST = process.env.HOST || 'localhost'
const PORT = process.env.PORT || 5000

const app = express()

// app.use(cors({

// }))

app.use(express.json())
app.use(helmet())
app.use(logger('dev'))

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

app.listen(PORT, debug(`Listening  http://${HOST}::${PORT}`))
