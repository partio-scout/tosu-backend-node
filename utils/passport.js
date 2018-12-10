const metadata = require('passport-saml-metadata')
const SamlStrategy = require('passport-saml').Strategy

module.exports = function (passport, config) {
  return metadata.fetch(config.passport.saml.metadata, { credentials: 'include' })
    .then(function (reader) {
      if (process.env.NODE_ENV !== 'test') {
        const strategyConfig = metadata.toPassportConfig(reader)
        strategyConfig.realm = config.passport.saml.issuer
        strategyConfig.issuer = config.passport.saml.issuer
        strategyConfig.protocol = 'samlp'

        const samlStrategy = new SamlStrategy(strategyConfig, function (profile, done) {
          console.log("profile:",profile)
          return done(null, profile)
        })

        passport.use('saml', samlStrategy);

        // Save user to session
        passport.serializeUser(function(user, done) {
          console.log("serializeUser:", user)
          done(null, user)
        });

        // Attach user to req.user
        passport.deserializeUser(function(user, done) {
          console.log("deserializeUser:", user)
          done(null, user)
        });
        console.log("------------SAML metadata:", strategyConfig)
        console.log("------------")

        return samlStrategy
      } else {
        return { logout: function (a, b) { return } } // Stub for testing
      }
    })
}
