let port = 3001
let localFrontend = 'http://localhost:3000'

module.exports = {
  port,
  localFrontend,
  passport: {
    strategy: 'saml',
    saml: {
      path: '/login/callback',
      // callbackUrl and logoutCallbackUrl are configured at IdP side
      // callbackUrl: `http://localhost:3001/scouts/login/callback`,
      // logoutCallbackUrl: `http://localhost:3001/scouts/logout/callback`,
      logoutCallback: '/logout/callback',
      issuer: 'https://suunnittelu.beta.partio-ohjelma.fi',
      metadata: {
        url: 'https://partioid-test.partio.fi/simplesaml/saml2/idp/metadata.php',
        timeout: process.env.SAML_METADATA_TIMEOUT || 30000,
        // TODO: Implement fileCache
        // backupStore: fileCache({
        //   basePath: process.env.SAML_METADATA_CACHE_DIR || os.tmpdir(),
        //   ns: process.env.SAML_ISSUER
        // })
      }
    }
  }
}
