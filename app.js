const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const path = require('path')

// Database
const db = require('./config/database')

// Test DB
db.authenticate()
  .then(() => console.log('Database connected...'))
  .catch((err) => console.log('Error: ' + err))

const app = express()

// parse application/json
app.use(bodyParser.json())

// Index route
// app.get('/', (req, res) => res.render('index', { layout: 'landing' }))
app.get('/', (req, res) => {
  res.json('hello world')
})

// Routes

const PORT = process.env.PORT || 5000

app.listen(PORT, console.log(`Server started on port ${PORT}`))
