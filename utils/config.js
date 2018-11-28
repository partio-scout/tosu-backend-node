let port = 3001

module.exports = {
  port,
  passport: {
      strategy: 'saml',
      saml: {
        path: '/login/callback', // Will be '/scouts/login/callback'
        // entryPoint: 'https://stubidp.sustainsys.com/', // TODO: add prod
        // entryPoint: 'https://partioid-test.partio.fi/simplesaml/module.php/selfregister/',
        entryPoint: 'https://partioid-test.partio.fi/simplesaml/saml2/idp/SSOService.php',
        issuer: 'https://localhost:3001/scouts/login/callback',
        cert: process.env.NODE_EXTRA_CA_CERTS || null
      }
    }
}
