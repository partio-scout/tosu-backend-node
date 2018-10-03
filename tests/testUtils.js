const mockSession = require('mock-session')
const Keygrip = require("keygrip")

function createCookie(cookieData) {
  return mockSession('session', process.env.SECRET_KEY, cookieData)
}

module.exports = { createCookie }
