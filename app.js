const express = require('express')
const models = require('./models')

// Database
const db = require('./config/database')

// Test DB
db.authenticate()
  .then(() => console.log('Database connected...'))
  .catch((err) => console.log('Error: ' + err))

const app = express()

// parse application/json
app.use(express.json())

// Index route
// app.get('/', (req, res) => res.render('index', { layout: 'landing' }))
app.get('/', async (req, res) => {
  const ParkingSpace = require('./models/parking-space')
  const space = await ParkingSpace.findOne({
    where: {
      id: 1
    }
  })

  res.json(space)
})

// Routes

const PORT = process.env.PORT || 5000

app.listen(PORT, console.log(`Server started on port ${PORT}`))
