const app = require('./app')
const winston = require('./config/winston')

const HOST = process.env.HOST || 'localhost'
const PORT = process.env.PORT || 5000

app.listen(PORT, winston.info(`Listening  http://${HOST}::${PORT}`))
