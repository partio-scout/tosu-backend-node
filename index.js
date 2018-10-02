const http = require('http')
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const middleware = require('./utils/middleware')
const config = require('./utils/config')
const app = express()
const cookieSession = require('cookie-session')
const cookieParser = require('cookie-parser')

const pofRouter = require('./controllers/pof')
const activityRouter = require('./controllers/activities')
const eventRouter = require('./controllers/events')
const scoutRouter = require('./controllers/scouts')

var corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true
}

app.use(cookieParser())
app.use(cookieSession({
  name: 'session',
  keys: [process.env.SECRET_KEY],

  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))

app.use(cors(corsOptions))
app.use(middleware.logger)
app.use(bodyParser.json())

app.use('/filledpof', pofRouter)
app.use('/activities', activityRouter)
app.use('/events', eventRouter)
app.use('/scouts', scoutRouter)

app.use(middleware.error)

const server = http.createServer(app)

if (process.env.NODE_ENV !== 'test') {
  server.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`)
  })
}

module.exports = {
  app, server
}
