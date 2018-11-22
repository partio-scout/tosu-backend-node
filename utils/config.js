let port = 3001

module.exports = {
  port,
  passport: {
      strategy: 'saml',
      saml: {
        path: '/login/callback', // Will be '/scouts/login/callback'
        entryPoint: 'https://partioid-test.partio.fi/simplesaml/module.php/selfregister/', // TODO: add prod
        issuer: 'passport-saml',
        cert: process.env.SAML_CERT || null
      }
    }
}
