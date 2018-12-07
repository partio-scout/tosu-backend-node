const supertest = require('supertest')
const mockSession = require('mock-session')
const Keygrip = require('keygrip')
const { app, server } = require('../../index')
const api = supertest(app)

const models = require('../../domain/models')
require('../handleTestDatabase')

test('Logging in with invalid token returns 403', async () => {
  await api
    .post('/scouts')
    .send({ Authorization: 'foo' })
    .expect(403)
})

// Google id tokens expire quite soon
// To test logging in generate a new token, use it and uncomment the test
/*
test('Logging in with a valid token works', async () => {
  const token = 'eyJhbGciOiJSUzI1NiIsImtpZCI6Ijk2MWNmNjBiY2VkZDkwNjdjNGNmMWYyZGRmNGVkNjEyYjUzNmZiMWEifQ.eyJpc3MiOiJhY2NvdW50cy5nb29nbGUuY29tIiwiYXpwIjoiNzM2MDEyNDA3My04ZjFicTRtdWw0MTVocjNrZG0xNTR2cTNjNjVscDM2ZC5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsImF1ZCI6IjczNjAxMjQwNzMtOGYxYnE0bXVsNDE1aHIza2RtMTU0dnEzYzY1bHAzNmQuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDE0MDYzMzMxMzk3MjI5ODc1ODMiLCJlbWFpbCI6InN1dW5uaXR0ZWx1cGFydGlvdGVzdGlAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImF0X2hhc2giOiJjQXRzVGRiQzBzbHBVak1OVEJUYzBRIiwibmFtZSI6IlN1dW5uaXR0ZWxpamEgUGFydGlvbGFpbmVuIiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS8teFBBcjltMkpBdncvQUFBQUFBQUFBQUkvQUFBQUFBQUFBQUEvQUFOMzFEV2R2ZmZldEtTLW5BbGdzem9BQlJLSEVGcFF4US9zOTYtYy9waG90by5qcGciLCJnaXZlbl9uYW1lIjoiU3V1bm5pdHRlbGlqYSIsImZhbWlseV9uYW1lIjoiUGFydGlvbGFpbmVuIiwibG9jYWxlIjoiZW4iLCJpYXQiOjE1MzkwODA4MTUsImV4cCI6MTUzOTA4NDQxNSwianRpIjoiZmIwYzkzYjZlNTc3YzkzOGNkNTJhOWQ3NzAxYjJkZTlmNTliYzVhMyJ9.XohmwYzs-7DVTLh5XumzRGuZS4iJGwHdkq1ywqENLiNapXXcATZgHDWNnYX1vLCaqCYjlL4LzJ4YC7UiZjkaq0Y5JVUrjVrC0ONadmwyG2UQ13SzktZVT1w1UtmiW-O32b6kPEyqsM0zO57agU_y9Ea-Moy-8euZFj_a2H7zXPwazJjkXg58-BLEcNLmxG3-oQHNM4ainnKDzLCgeA__QyywLhltzoEzMAzDCtCz_KIB5Gje8cZ978FHUwouVDYCES1yQi0J8cEivWgZ_Z1FgVHtDfatok-hvV_dsRylXsqTNEfpbsNrncDqtudZlE7EiAZGf26W_nif5_xIZkl6fQ'
  await api
    .post('/scouts')
    .send({ Authorization: token })
    .expect(200)
    .then( (result) => {
      expect(result.body.googleId).toBe('101406333139722987583')
    })
})
*/

test('Logout works', async () => {
  await api
    .post('/scouts/logout')
    .expect(200)
})

// TODO:
test('Registering new scout creates buffer', async () => {
  expect(true).toBe(true)
})
