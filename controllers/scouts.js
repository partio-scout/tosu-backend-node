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

  // Called by frontend
  // scoutRouter.get('/logout', function (req, res) {
  //   // req.logout()
  //   // req.session = null
  //   // // TODO: invalidate session on IP (?)
  //   // res.redirect('/')
  //
  //   if (!req.user) return res.redirect('http://localhost:3000');
  //
  //   req.user.saml = {};
  //    req.user.saml.nameID = req.user.nameID;
  //    req.user.saml.nameIDFormat = req.user.nameID;
  //  req.user.id = req.user.saml.nameID;
  //  req.user.nameIDFormat = req.user.saml.nameIDFormat;
  //
  //  console.log("initiating logout", req.user);
  //   req.session = null
  //   return passport._strategy('saml').logout(req, function(err, uri) {
  //     req.logout()
  //     return res.redirect('http://localhost:3000');
  //   });
  // })



// TODO: Clean up this mess!
  var SamlStrategy = require('passport-saml').Strategy;
var samlStrategy = new SamlStrategy({
path: '/login/callback',
identityProviderUrl: 'https://partioid-test.partio.fi/simplesaml/saml2/idp/SSOService.php',
  entryPoint: 'https://partioid-test.partio.fi/simplesaml/saml2/idp/SSOService.php',
  logoutUrl: 'https://partioid-test.partio.fi/simplesaml/saml2/idp/SingleLogoutService.php',
  cert: 'MIID+DCCAuCgAwIBAgIJAKvOFfx8U3hAMA0GCSqGSIb3DQEBCwUAMIGQMQswCQYDVQQGEwJGSTEQMA4GA1UECAwHVXVzaW1hYTEOMAwGA1UEBwwFRXNwb28xEDAOBgNVBAoMB05peHVPeWoxCzAJBgNVBAsMAkRJMRYwFAYDVQQDDA1wYXJ0aW9pZC10ZXN0MSgwJgYJKoZIhvcNAQkBFhlrcmlzdGlpbmEubWFydGluQG5peHUuY29tMB4XDTE3MTIwNzExNDM0MFoXDTI3MTIwNzExNDM0MFowgZAxCzAJBgNVBAYTAkZJMRAwDgYDVQQIDAdVdXNpbWFhMQ4wDAYDVQQHDAVFc3BvbzEQMA4GA1UECgwHTml4dU95ajELMAkGA1UECwwCREkxFjAUBgNVBAMMDXBhcnRpb2lkLXRlc3QxKDAmBgkqhkiG9w0BCQEWGWtyaXN0aWluYS5tYXJ0aW5Abml4dS5jb20wggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQDhGlAmeb+DcN+I7NnBYDmmBLbJYyuU2yoqgp1VMdYMEvmlKq58vt/Qc/rINoX3pRWPFHeQIOOr9/T3fERJk4/1vNWU4aYP+oQtbEPgLHzeZtYKCkYNSL22XMK/xMqq9Hvn2NtwSW9x0OVJp6gPDHxO+986+E/ZmXdMU+0YL7TsFluO455xDt99ss02uCeojLS0dZ3jr0dGvDM1G816r3RjNnK1lNe/e18+NN8eStEt1RixO02e0adU8Yor8vaZsz1wiydEzs49ADFcVgomRm5tywYn+gNuVeV+0j05Y7qDkofrWwgAzwu7utwN+/s0knin+afU6i/tTyxclpGArR0RAgMBAAGjUzBRMB0GA1UdDgQWBBQRsLKAyuuOWzgy9sPWTUC3CaE0SzAfBgNVHSMEGDAWgBQRsLKAyuuOWzgy9sPWTUC3CaE0SzAPBgNVHRMBAf8EBTADAQH/MA0GCSqGSIb3DQEBCwUAA4IBAQDebik6zLdjHfe2aHJisLXB9MUKbEnSDlXeCDUl/m9jqBG/31jCh53qwzhBXqtLkCkeRYFRNwQSt9Roh2nFbuSOE1k4qLMAL3dzsgLmWhUrNYZ4gCyfu0bROmZfol84ofpxzyIJSgKi5cK6ZSSGfDyM22uCxOWzJo/+b2kOV1F+DcyvVZUIFuoDGH3StPY0EcwtMd3Xt4jGXKfDoDoRlduwTKq+pn9iEjQ6angG6+UKLU6jyeqBIW1SdZmU28OgeST39tgkQVQ/9cblcKSi7r+PQ3yJs1EcFvagHhZgq/z+xUNgs6If1wBgG9Es5JSjiD09GykA7VRxyk/slJnm5Dsp',
  identifierFormat: 'urn:oasis:names:tc:SAML:2.0:nameid-format:transient',
  realm: 'https://suunnittelu.beta.partio-ohjelma.fi',
  issuer: 'https://suunnittelu.beta.partio-ohjelma.fi',
  protocol: 'samlp',
  path: '/saml/consume',
  host: 'localhost',
  authnContext: 'urn:oasis:names:tc:SAML:2.0:ac:classes:PasswordProtectedTransport',
  acceptedClockSkewMs: 0,
  validateInResponseTo: false,
  requestIdExpirationPeriodMs: 28800000,
  signatureAlgorithm: 'sha1'
}, function(profile, done) {
return done(null, {
id: profile.nameID,
sessionIndex: profile.sessionIndex,
email: profile.Email,
firstName: profile.FirstName,
lastName: profile.LastName,
roles: profile.RoleInfo,
});
});

scoutRouter.get('/logout', function(req, res) {
console.log('In int----------------------------');
//Here add the nameID and nameIDFormat to the user if you stored it someplace.
if (req.user == null) {
return res.redirect('http://localhost:3000');
}

  req.user.saml = {};
  req.user.saml.nameID = req.user.nameID;
  req.user.saml.nameIDFormat = req.user.nameIDFormat;


req.user.id = req.user.saml.nameID;
req.user.nameIDFormat = req.user.saml.nameIDFormat;


samlStrategy.logout(req, function(err, request){
    if(!err){
        req.logout() // Logout locally
        res.redirect(request) // Redirect to the IdP Logout URL (partio.fi)
    }
 });
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
