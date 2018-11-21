const scoutRouter = require('express').Router()
const models = require('../domain/models')
const verifyService = require('../services/verifyService')
const scoutService = require('../services/scoutService')

module.exports = function (config, passport) {

  /*
    Login/logout with GoogleIdToken sent from the client
  */

  scoutRouter.post('/', async (req, res) => {
    const idTokenString = req.body.Authorization
    const idToken = await verifyService.verifyId(idTokenString)

    if (!idToken) {
      return res.status(403).send('Unable to verify idToken')
    }

    const scout = await scoutService.findOrCreateScout(idToken)
    req.session.scout = scout
    res.json(scout)
  })

  scoutRouter.post('/logout', async (req, res) => {
    req.session = null
    res.send('Logout successful')
  })

  /*
    Login/logout with SAML & partioID
    https://github.com/bergie/passport-saml
    https://github.com/gbraad/passport-saml-example
  */

  // Called by the client to login
  // Calls the Identity Provider (partioID) to authenticate
  scoutRouter.get('/login', // Why not POST...?
    passport.authenticate(config.passport.strategy, {
      successRedirect: '/',
      failureRedirect: '/'
    })
  )

  // Identity Provider calls back to inform of successful authentication
  scoutRouter.post(config.passport.saml.path,
    passport.authenticate(config.passport.strategy, {
      failureRedirect: '/',
      failureFlash: true
    }),
    function (req, res) {
      res.redirect('/')
    }
  )

  scoutRouter.get('/logout', function (req, res) { // Why not POST..?
    req.logout();
    // TODO: invalidate session on IP (?)
    res.redirect('/');
  })
}
