const express = require('express')
const helmet = require('helmet')
const logger = require('morgan')
const routers = require('./routes')
// const cors = require('cors')
const debug = require('debug')('luca:app')
const PORT = process.env.PORT || 5000

const app = express()

// app.use(cors(corsOptions))
app.use(express.json())
app.use(helmet())
app.use(logger('dev'))

// ===========================================================================
// Routes
// ===========================================================================

app.use('/api/parking-spaces', routers.parkingSpaces)
app.use('/api/rental-agreements', routers.rentalAgreements)

// ===========================================================================

app.listen(PORT, debug(`Listening on port ${PORT}`))
