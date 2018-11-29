const metadata = require('passport-saml-metadata')
const SamlStrategy = require('passport-saml').Strategy

// module.exports = function (passport, config) {
//
//   passport.serializeUser(function (user, done) {
//     done(null, user)
//   })
//
//   passport.deserializeUser(function (user, done) {
//     done(null, user)
//   })
//
//   passport.use(new SamlStrategy(
//     {
//       path: '/scouts' + config.passport.saml.path,
//       entryPoint: config.passport.saml.entryPoint,
//       issuer: config.passport.saml.issuer,
//       cert: config.passport.saml.cert
//     },
//     function (profile, done) {
//       return done(null, {
//         id: profile.uid,
//         email: profile.email,
//         displayName: profile.cn,
//         firstName: profile.givenName,
//         lastName: profile.sn
//       })
//     })
//   )
// }

module.exports = function (passport, config) {
  metadata.fetch(config.passport.saml.metadata)
    .then(function (reader) {
      const strategyConfig = metadata.toPassportConfig(reader);
      strategyConfig.realm = config.passport.saml.issuer,
      strategyConfig.issuer = config.passport.saml.issuer,
      strategyConfig.protocol = 'samlp';

      strategyConfig.callbackUrl = 'http://localhost:3001/scouts/login/callback'
      // strategyConfig.entryPoint = 'https://stubidp.sustainsys.com/'

      passport.use('saml', new SamlStrategy(strategyConfig, function (profile, done) {
        profile = metadata.claimsToCamelCase(profile, reader.claimSchema);
        return done(null, profile);
      }));

      passport.serializeUser(function(user, done) {
        console.log("serializeUser:", user)
        done(null, user);
      });

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
