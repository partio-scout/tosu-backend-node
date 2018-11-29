const metadata = require('passport-saml-metadata')
const SamlStrategy = require('passport-saml').Strategy

module.exports = function (passport, config) {

  passport.serializeUser(function (user, done) {
    done(null, user)
  })

  passport.deserializeUser(function (user, done) {
    done(null, user)
  })

  passport.use(new SamlStrategy(
    {
      path: '/scouts' + config.passport.saml.path,
      entryPoint: config.passport.saml.entryPoint,
      issuer: config.passport.saml.issuer,
      cert: config.passport.saml.cert
    },
    function (profile, done) {
      return done(null, {
        id: profile.uid,
        email: profile.email,
        displayName: profile.cn,
        firstName: profile.givenName,
        lastName: profile.sn
      })
    })
  )
}

// module.exports = function (passport, config) {
//   metadata.fetch(config.passport.saml.metadata)
//     .then(function (reader) {
//       const strategyConfig = metadata.toPassportConfig(reader);
//       console.log("SAML metadata:", strategyConfig)
//       strategyConfig.realm = config.passport.saml.issuer,
//       strategyConfig.protocol = 'samlp';
//
//       passport.use('saml', new SamlStrategy(strategyConfig, function (profile, done) {
//         profile = metadata.claimsToCamelCase(profile, reader.claimSchema);
//         return done(null, profile);
//       }));
//
//       passport.serializeUser(function(user, done) {
//         done(null, user);
//       });
//
//       passport.deserializeUser(function(user, done) {
//         done(null, user);
//       });
//     })
//     .catch((err) => {
//       console.error('Error loading SAML metadata', err);
//       process.exit(1);
//     });
// };
