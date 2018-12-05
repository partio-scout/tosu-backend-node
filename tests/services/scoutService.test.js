const models = require('../../domain/models')
const scoutService = require('../../services/scoutService')
require('../handleTestDatabase')

var mockToken
var user

beforeEach(() => {
  mockToken = generateMockToken()
  user = {
    firstname: "John",
    lastname: "Smith",
    membernumber: 7584309
  }
})

test('Finding an existing scout', async () => {
  const scout = await models.Scout.create({ name: "Tester Dude", googleId: mockToken })
  const found = await scoutService.findOrCreateScoutByGoogleToken(googleIdTokenMock(mockToken, scout.name))
  expect(found.id).toBe(scout.id)
  expect(found.name).toBe(scout.name)
})

test('Creating a new scout with googleToken', async () => {
  const newScoutGoogleIdToken = googleIdTokenMock(mockToken, "Tester Girl")
  const found = await scoutService.findOrCreateScoutByGoogleToken(googleIdTokenMock(mockToken, "Tester Girl"))
  expect(found.id).not.toBeNull()
  expect(found.name).toBe("Tester Girl")
  expect(found.googleId).not.toBeNull()
  expect(found.partioId).toBeNull()
})

test('Creating a new scout with partioID', async () => {
  const found = await scoutService.findOrCreateScoutByMemberNumber(user)
  expect(found.id).not.toBeNull()
  expect(found.name).toBe("John Smith")
  expect(found.googleId).toBeNull()
  expect(found.partioId).not.toBeNull()
})

test('Creating a new scout with googleToken creates an activityBuffer', async () => {
  const newScoutGoogleIdToken = googleIdTokenMock(mockToken, "Tester Girl")
  const created = await scoutService.findOrCreateScoutByGoogleToken(googleIdTokenMock(mockToken, "Tester Girl"))
  const foundBuffer = await models.ActivityBuffer.findOne({
    where: { scoutId: created.id }
  })
  expect(foundBuffer).not.toBeNull()
  expect(foundBuffer.scoutId).toBe(created.id)
})

test('Creating a new scout with partioID creates an activityBuffer', async () => {
  const created = await scoutService.findOrCreateScoutByMemberNumber(user)
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
