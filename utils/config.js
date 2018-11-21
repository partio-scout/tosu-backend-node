let port = 3001

module.exports = {
  port,
  passport: {
      strategy: 'saml',
      saml: {
        path: '/login/callback', // Will be ''/scouts/login/callback'
        entryPoint: 'https://openidp.feide.no/simplesaml/saml2/idp/SSOService.php', // TODO: partio url here
        issuer: 'passport-saml',
        cert: process.env.SAML_CERT || null
      }
    }
}
