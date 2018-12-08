const mockSession = require('mock-session')
const Keygrip = require('keygrip')

// Creates a cookie with the same secret key in the same way as cookie-session
// to be passed to the api and controllers with .set('cookie', [cookie])
function createCookie(cookieData) {
  return mockSession('session', process.env.SECRET_KEY, cookieData)
}

function createScoutCookieWithId(scoutId) {
  return createCookie({ 'scout': { 'id': scoutId } })
}

module.exports = {
  createCookie,
  createScoutCookieWithId
}
