const models = require('../../domain/models')
const scoutService = require('../../services/scoutService')
require('../handleTestDatabase')

var mockToken

beforeEach(() => {
  mockToken = generateMockToken()
})

test('Finding an existing scout', async () => {
  const scout = await models.Scout.create({ name: "Tester Dude", googleId: mockToken })
  const found = await scoutService.findOrCreateScout(googleIdTokenMock(mockToken, scout.name))
  expect(found.id).toBe(scout.id)
  expect(found.name).toBe(scout.name)
})

test('Creating a new scout', async () => {
  const newScoutGoogleIdToken = googleIdTokenMock(mockToken, "Tester Girl")
  const found = await scoutService.findOrCreateScout(googleIdTokenMock(mockToken, "Tester Girl"))
  expect(found.id).not.toBeNull()
  expect(found.name).toBe("Tester Girl")
})

test('Creating a new scout creates an activityBuffer', async () => {
  const newScoutGoogleIdToken = googleIdTokenMock(mockToken, "Tester Girl")
  const created = await scoutService.findOrCreateScout(googleIdTokenMock(mockToken, "Tester Girl"))
  const foundBuffer = await models.ActivityBuffer.findOne({
    where: { scoutId: created.id }
  })
  expect(foundBuffer).not.toBeNull()
  expect(foundBuffer.scoutId).toBe(created.id)
})

function googleIdTokenMock(mockToken, name) {
  return {
    getPayload: function () {
      return {"sub": mockToken, "name": name}
    }
  }
}

function generateMockToken() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 50; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}
