const models = require('../domain/models')
const bufferService = require('./activitybufferService')

// Finds or creates a scout with given googleIdToken and returns it.
async function findOrCreateScoutByGoogleToken(googleIdToken) {
  const userId = googleIdToken.getPayload()['sub']
  const name = googleIdToken.getPayload()['name'] // TODO: Would be better to save first and last names separately
  return await findOrCreate({
    where: {
      googleId: { $eq: userId },
    },
    defaults: {
      googleId: userId,
      name: name,
    },
  })
}

async function findOrCreateScoutByMemberNumber(user) {
  return await findOrCreate({
    where: {
      partioId: { $eq: user.membernumber },
    },
    defaults: {
      partioId: user.membernumber,
      name: user.firstname + ' ' + user.lastname, // TODO: Would be better to save first and last names separately
    },
  })
}

async function findOrCreate(queryConditions) {
  const scout = await models.Scout.findOrCreate(queryConditions).spread(
    async (user, created) => {
      // user: first found result, created: whether user was created or found
      // If the scout logged in for the first time, create buffer
      if (created) {
        await bufferService.createBufferForScout(user)
      }
      return user
    }
  )

  return scout
}

module.exports = {
  findOrCreateScoutByGoogleToken,
  findOrCreateScoutByMemberNumber,
}
