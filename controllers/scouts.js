const scoutRouter = require('express').Router()
const models = require('../domain/models')
const verifyService = require('../services/verifyService')
const scoutService = require('../services/scoutService')

module.exports = function (config, passport) {

  //  Login with GoogleIdToken sent from the client
  scoutRouter.post('/google/login', async (req, res) => {
    const idTokenString = req.body.Authorization
    const idToken = await verifyService.verifyId(idTokenString)

    if (!idToken) {
      return res.status(403).send('Unable to verify idToken')
    }

    const scout = await scoutService.findOrCreateScoutByGoogleToken(idToken)
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
    }),
    async (req, res) => {
      console.log("user who logged in:", req.user)

      const membernumber = parseInt(req.user.membernumber)
      if (isNaN(membernumber)) return res.status(500).send("membernumber is Nan")

      const scout = await scoutService.findOrCreateScoutByMemberNumber(req.user)
      var scoutInfo = { name: scout.name } // Send only necessary, harmless info to a client cookie
      req.session.scout = scout
      res.cookie('scout', JSON.stringify(scoutInfo), { maxAge: 7200000 }) // 2 hours
      res.redirect(config.localFrontend)
    }
  )

  // Called by frontend to log out. Also logs out from other partioid single sign out service providers.
  // Could not get to work without reinitializing samlStrategy:
  // https://github.com/bergie/passport-saml/issues/200
  require('../utils/passport')(passport, config).then(function (samlStrategy) {
    scoutRouter.get('/logout', function(req, res) {
      if (req.user == null) {
        return res.redirect(config.localFrontend)
      }

      // Here add the nameID and nameIDFormat to the user
      req.user.saml = {}
      req.user.saml.nameID = req.user.nameID
      req.user.saml.nameIDFormat = req.user.nameIDFormat
      req.user.id = req.user.saml.nameID

      samlStrategy.logout(req, function(err, request){
        if (!err) {
          req.logout() // Logout locally
          res.redirect(request) // Redirect to the IdP Logout URL
        }
      })
    })
  })

  // Called by IdP to logout
  scoutRouter.get(config.passport.saml.logoutCallback, function(req, res) {
    console.log("completing logout", req.user)
    req.logout()
    req.session = null
    res.clearCookie('scout')
    res.redirect(config.localFrontend)
  })

  return scoutRouter
}
