const models = require('../domain/models')
const bufferService = require('./activitybufferService')

// Finds or creates a scout with given googleIdToken and returns it.
async function findOrCreateScout(googleIdToken) {
  const userId = googleIdToken.getPayload()['sub']
  const name = googleIdToken.getPayload()['name']
  return await findOrCreate(userId, name)
}

async function findOrCreateScoutByMemberNumber(user) {
  // TODO: Add a mew column for partioid in model Scout
  return await findOrCreate(user.memberNumber+"", user.firstname + " " + user.lastname)
}

async function findOrCreate(userId, name) {
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
  findOrCreateScoutByMemberNumber,
}
