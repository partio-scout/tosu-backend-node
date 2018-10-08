const models = require('../domain/models')

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
  }).spread((user, created) => user) // user: first found result, created: whether user was created or found

  return scout
}

module.exports = {
  findOrCreateScout
}
