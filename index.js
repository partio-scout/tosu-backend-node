const http = require('http')
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const middleware = require('./utils/middleware')
const config = require('./utils/config')
const app = express()
const cookieSession = require('cookie-session')
const cookieParser = require('cookie-parser')
const passport = require('passport')
const metadata = require('passport-saml-metadata').metadata
require('./utils/passport')(passport, config)

const verifyService = require('./services/verifyService')
const pofRouter = require('./controllers/pof')
const activityRouter = require('./controllers/activities')
const eventgroupRouter = require('./controllers/eventgroups')
const eventRouter = require('./controllers/events')
const scoutRouter = require('./controllers/scouts')
const planRouter = require('./controllers/plans')
const activityBufferRouter = require('./controllers/activitybuffers')

var corsOptions = {
  origin: ['http://localhost:3000',
    'https://suunnittelu.partio-ohjelma.fi',
    'https://suunnittelu.beta.partio-ohjelma.fi',
    'https://demo.kehatieto.fi',
    'https://kuksa.partio.fi',
    'https://partioid-test.partio.fi',
    'https://id.partio.fi'
  ], credentials: true
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
app.use(bodyParser.urlencoded({extended: true}))

app.use(passport.initialize())
app.use(passport.session())
metadata(config.passport.saml)

const loggedIn = async (req, res, next) => {
  // TODO: Remove verifyService.isLoggedIn once GoogleLogin is no longer implemented
  if (await verifyService.isLoggedIn(req.session.scout) || req.isAuthenticated()) {
    next()
  } else {
    res.status(403).send('You are not logged in')
  }
}
var options_sendfile = {
  root: __dirname + '/build/',
}

app.use('/activities', loggedIn)
app.use('/events', loggedIn)
app.use('/activitybuffers', loggedIn)
app.use('/plans', loggedIn)

app.use('/filledpof', pofRouter)
app.use('/activities', activityRouter)
app.use('/eventgroups', eventgroupRouter)
app.use('/events', eventRouter)
app.use('/scouts', scoutRouter(config, passport))
app.use('/plans', planRouter)
app.use('/activitybuffers', activityBufferRouter)

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
