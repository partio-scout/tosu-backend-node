const models = require('../domain/models')
const bufferService = require('./activitybufferService')

// Finds or creates a scout with given googleIdToken and returns it.
async function findOrCreateScout(googleIdToken) {
  const userId = googleIdToken.getPayload()['sub']
  const name = googleIdToken.getPayload()['name']

  const scout = await models.Scout.findOrCreate({
    where: {
      googleId: { $eq: userId }
    },
    defaults: {
      googleId: userId,
      name: name
    }
  }).spread(async (user, created) => { // user: first found result, created: whether user was created or found
    // If the scout logged in for the first time, create buffer
    if (created) {
      await bufferService.createBufferForScout(user)
    }
    return user
  })

  return scout
}

module.exports = {
  findOrCreateScout,
}
