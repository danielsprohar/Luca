const express = require('express')
const helmet = require('helmet')
const logger = require('morgan')
// const cors = require('cors')

const app = express()

// app.use(cors(corsOptions))
app.use(express.json())
app.use(helmet())
app.use(logger('dev'))

// ===========================================================================
// Routes
// ===========================================================================

const parkingSpacesRouter = require('./routes/parking-space-routes')

app.use('/api/parking-spaces', parkingSpacesRouter)

// ===========================================================================

const PORT = process.env.PORT || 5000

app.listen(PORT, console.log(`Server started on port ${PORT}`))
