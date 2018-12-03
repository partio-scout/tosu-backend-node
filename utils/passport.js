const metadata = require('passport-saml-metadata')
const SamlStrategy = require('passport-saml').Strategy

module.exports = function (passport, config) {
  metadata.fetch(config.passport.saml.metadata, {credentials: 'include'}) // credentials not necessary(?)
    .then(function (reader) {
      const strategyConfig = metadata.toPassportConfig(reader);
      strategyConfig.realm = config.passport.saml.issuer
      strategyConfig.issuer = config.passport.saml.issuer
      strategyConfig.protocol = 'samlp'

      passport.use('saml', new SamlStrategy(strategyConfig, function (profile, done) {
        console.log("profile:",profile)
        // profile = metadata.claimsToCamelCase(profile, reader.claimSchema)
        return done(null, profile);
      }));

      // Save user to session
      passport.serializeUser(function(user, done) {
        console.log("serializeUser:", user)
        done(null, user);
      });

      // Attach user to req.user
      passport.deserializeUser(function(user, done) {
        console.log("deserializeUser:", user)
        done(null, user);
      });
      console.log("------------SAML metadata:", strategyConfig)
      console.log("------------")

    })
    .catch((err) => {
      console.error('Error loading SAML metadata', err);
      process.exit(1);
    });
};
