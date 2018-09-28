const http = require('http')
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const middleware = require('./utils/middleware')
const config = require('./utils/config')
const app = express()
var cookieSession = require('cookie-session')

const pofRouter = require('./controllers/pof')
const activityRouter = require('./controllers/activities')

var corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true
}

app.use(cookieSession({
  name: 'session',
  keys: ['key'],

  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))

app.use(cors(corsOptions))
app.use(middleware.logger)
app.use(bodyParser.json())

app.use('/filledpof', pofRouter)
app.use('/activities', activityRouter)

app.use(middleware.error)

const server = http.createServer(app)

server.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`)
})

module.exports = {
  app, server
}
