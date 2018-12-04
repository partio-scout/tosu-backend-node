const scoutRouter = require('express').Router()
const models = require('../domain/models')
const verifyService = require('../services/verifyService')
const scoutService = require('../services/scoutService')

module.exports = function (config, passport) {

  /*
    Login/logout with GoogleIdToken sent from the client
  */

  scoutRouter.post('/google/login', async (req, res) => {
    const idTokenString = req.body.Authorization
    const idToken = await verifyService.verifyId(idTokenString)

    if (!idToken) {
      return res.status(403).send('Unable to verify idToken')
    }

    const scout = await scoutService.findOrCreateScout(idToken)
    req.session.scout = scout
    res.json(scout)
  })

  // Called by the client to login
  // Calls the Identity Provider (partioID) to authenticate
  scoutRouter.get('/login',
    passport.authenticate(config.passport.strategy, {
      successRedirect: '/',
      failureRedirect: '/',
    })
  )

  // Identity Provider calls back to inform of successful authentication
  // Then req.isAuthenticated() can be used
  scoutRouter.post(config.passport.saml.path,
    passport.authenticate(config.passport.strategy, {
      failureRedirect: '/',
      failureFlash: true,
      // session: true
    }),
    async (req, res) => {
      console.log("user who logged in:", req.user)

      const membernumber = parseInt(req.user.membernumber)
      if (isNaN(membernumber)) return res.status(500).send("membernumber is Nan")

      const scout = await scoutService.findOrCreateScoutByMemberNumber(req.user) // TODO don't use googleID col
      req.session.scout = scout
      res.cookie('scout', JSON.stringify(scout)) // TODO: Make expire?
      res.redirect('http://localhost:3000')
    }
  )

  // Called by frontend to logout (messy...)
  const metadata = require('passport-saml-metadata')
  const SamlStrategy = require('passport-saml').Strategy

  metadata.fetch(config.passport.saml.metadata, {credentials: 'include'}) // credentials not necessary(?)
    .then(function (reader) {
      const strategyConfig = metadata.toPassportConfig(reader)
      strategyConfig.realm = config.passport.saml.issuer
      strategyConfig.issuer = config.passport.saml.issuer
      strategyConfig.protocol = 'samlp'

      var samlStrategy = new SamlStrategy(strategyConfig, function (profile, done) {
        console.log("profile:",profile)
        // profile = metadata.claimsToCamelCase(profile, reader.claimSchema)
        return done(null, profile)
      })

      scoutRouter.get('/logout', function(req, res) {
        // Here add the nameID and nameIDFormat to the user if you stored it someplace.
        if (req.user == null) {
          return res.redirect('http://localhost:3000')
        }

        req.user.saml = {}
        req.user.saml.nameID = req.user.nameID
        req.user.saml.nameIDFormat = req.user.nameIDFormat
        req.user.id = req.user.saml.nameID
        req.user.nameIDFormat = req.user.saml.nameIDFormat

        samlStrategy.logout(req, function(err, request){
          if (!err) {
            req.logout() // Logout locally
            res.redirect(request) // Redirect to the IdP Logout URL (partio.fi)
          }
        });
      })
    })
    .catch((err) => {
      console.error('Error loading SAML metadata', err)
      process.exit(1)
    })

  // Called by IdP to logout
  scoutRouter.get(config.passport.saml.logoutCallback, function(req, res) {
    req.log.info("completing logout", req.user)
    req.logout()
    req.session = null
    res.redirect('/')
  })

  scoutRouter.get('/test', async (req, res) => {
    res.status(200).send(req.user)
  })

  return scoutRouter
}
