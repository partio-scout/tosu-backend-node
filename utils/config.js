let port = 3001

module.exports = {
  port,
  passport: {
      strategy: 'saml',
      saml: {

        //

        path: '/login/callback',
        callbackUrl: `http://localhost:3001/scouts/login/callback`,
        logoutCallbackUrl: `http://localhost:3001/scouts/logout/callback`,
        issuer: 'https://suunnittelu.beta.partio-ohjelma.fi',
        metadata: {
          url: 'https://partioid-test.partio.fi/simplesaml/saml2/idp/metadata.php',
          // url: 'https://stubidp.sustainsys.com/Metadata/BrowserFriendly',
          timeout: process.env.SAML_METADATA_TIMEOUT || 30000,
          // backupStore: fileCache({
          //   basePath: process.env.SAML_METADATA_CACHE_DIR || os.tmpdir(),
          //   ns: process.env.SAML_ISSUER
          // })
        }
      }
    }
}

// path: '/login/callback', // Will be '/scouts/login/callback'
// // entryPoint: 'https://stubidp.sustainsys.com/', // TODO: add prod
// entryPoint: 'https://partioid-test.partio.fi/simplesaml/saml2/idp/SSOService.php',
// issuer: 'https://suunnittelu.beta.partio-ohjelma.fi',
// cert: 'MIID+DCCAuCgAwIBAgIJAKvOFfx8U3hAMA0GCSqGSIb3DQEBCwUAMIGQMQswCQYDVQQGEwJGSTEQMA4GA1UECAwHVXVzaW1hYTEOMAwGA1UEBwwFRXNwb28xEDAOBgNVBAoMB05peHVPeWoxCzAJBgNVBAsMAkRJMRYwFAYDVQQDDA1wYXJ0aW9pZC10ZXN0MSgwJgYJKoZIhvcNAQkBFhlrcmlzdGlpbmEubWFydGluQG5peHUuY29tMB4XDTE3MTIwNzExNDM0MFoXDTI3MTIwNzExNDM0MFowgZAxCzAJBgNVBAYTAkZJMRAwDgYDVQQIDAdVdXNpbWFhMQ4wDAYDVQQHDAVFc3BvbzEQMA4GA1UECgwHTml4dU95ajELMAkGA1UECwwCREkxFjAUBgNVBAMMDXBhcnRpb2lkLXRlc3QxKDAmBgkqhkiG9w0BCQEWGWtyaXN0aWluYS5tYXJ0aW5Abml4dS5jb20wggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQDhGlAmeb+DcN+I7NnBYDmmBLbJYyuU2yoqgp1VMdYMEvmlKq58vt/Qc/rINoX3pRWPFHeQIOOr9/T3fERJk4/1vNWU4aYP+oQtbEPgLHzeZtYKCkYNSL22XMK/xMqq9Hvn2NtwSW9x0OVJp6gPDHxO+986+E/ZmXdMU+0YL7TsFluO455xDt99ss02uCeojLS0dZ3jr0dGvDM1G816r3RjNnK1lNe/e18+NN8eStEt1RixO02e0adU8Yor8vaZsz1wiydEzs49ADFcVgomRm5tywYn+gNuVeV+0j05Y7qDkofrWwgAzwu7utwN+/s0knin+afU6i/tTyxclpGArR0RAgMBAAGjUzBRMB0GA1UdDgQWBBQRsLKAyuuOWzgy9sPWTUC3CaE0SzAfBgNVHSMEGDAWgBQRsLKAyuuOWzgy9sPWTUC3CaE0SzAPBgNVHRMBAf8EBTADAQH/MA0GCSqGSIb3DQEBCwUAA4IBAQDebik6zLdjHfe2aHJisLXB9MUKbEnSDlXeCDUl/m9jqBG/31jCh53qwzhBXqtLkCkeRYFRNwQSt9Roh2nFbuSOE1k4qLMAL3dzsgLmWhUrNYZ4gCyfu0bROmZfol84ofpxzyIJSgKi5cK6ZSSGfDyM22uCxOWzJo/+b2kOV1F+DcyvVZUIFuoDGH3StPY0EcwtMd3Xt4jGXKfDoDoRlduwTKq+pn9iEjQ6angG6+UKLU6jyeqBIW1SdZmU28OgeST39tgkQVQ/9cblcKSi7r+PQ3yJs1EcFvagHhZgq/z+xUNgs6If1wBgG9Es5JSjiD09GykA7VRxyk/slJnm5Dsp'
