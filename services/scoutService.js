const models = require('../domain/models')
const bufferService = require('./activitybufferService')

/**
 * Find or create new scout using googleIdToken
 * @param googleIdToken - Unique toke for the user
 * @returns Instance of Scout model
 */
const findOrCreateScoutByGoogleToken = async googleIdToken => {
  const userId = googleIdToken.getPayload()['sub']
  const name = googleIdToken.getPayload()['name'] // TODO: Would be better to save first and last names separately
  return await findOrCreate({
    where: {
      googleId: { $eq: userId }
    },
    defaults: {
      googleId: userId,
      name: name
    }
  })
}

/**
 * Find or create new scout using member number
 * @param user - The member number of the scout
 * @returns Instance of Scout model
 */
const findOrCreateScoutByMemberNumber = async user => {
  console.log('käyttäjä:', user)
  return await findOrCreate({
    where: {
      partioId: { $eq: user.membernumber }
    },
    defaults: {
      partioId: user.membernumber,
      name: user.firstname + ' ' + user.lastname // TODO: Would be better to save first and last names separately
    }
  })
}
/**
 * Deletes a scout by using it's member number
 * @param {*} id partioId of scout
 */
async function deleteScoutByMemberNumber(id) {
  try {
    const rowsDeleted = await models.Scout.destroy({
      where: {
        partioId: { $eq: id }
      }
    })
    if (rowsDeleted === 1) {
      return true
    } else {
      return false
    }
  } catch (error) {
    console.log('Error while deleting scout: ', error)
    return false
  }
}

/**
 * Find the scout or create new one along with ActivityBuffer and first Tosu
 * @param {*} queryConditions
 * @returns Instance of Scout model
 */
const findOrCreate = async queryConditions => {
  const scout = await models.Scout.findOrCreate(queryConditions).spread(
    async (user, created) => {
      // user: first found result, created: whether user was created or found
      // If the scout logged in for the first time, create buffer and first tosu
      if (created) {
        await bufferService.createBufferForScout(user)
        await models.Tosu.create({
          name: 'Yleinen',
          scoutId: user.id,
          selected: true
        })
      }
      return user
    }
  )
  return scout
}

module.exports = {
  findOrCreateScoutByGoogleToken,
  findOrCreateScoutByMemberNumber,
  deleteScoutByMemberNumber
}
