const express = require('express')
const helmet = require('helmet')
const logger = require('morgan')
const routers = require('./routes')
// const cors = require('cors')
const debug = require('debug')('luca:app')

const HOST = process.env.HOST || 'localhost'
const PORT = process.env.PORT || 5000

const app = express()

// app.use(cors(corsOptions))
app.use(express.json())
app.use(helmet())
app.use(logger('dev'))

// ===========================================================================
// Routes
// ===========================================================================

app.use('/api/customers', routers.customersRouter)
app.use('/api/parking-spaces', routers.parkingSpacesRouter)
app.use('/api/rental-agreements', routers.rentalAgreementsRouter)

// ===========================================================================

app.listen(PORT, debug(`Listening  http://${HOST}::${PORT}`))
