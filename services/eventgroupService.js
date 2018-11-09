const models = require('../domain/models')


// Creates an event group
async function createEventGroup() {
  const eventGroup = await models.EventGroup.create()
  return await eventGroup
}

// Deletes an event group
async function deleteEventGroup(eventGroupId) {
  const rowsDeleted = await models.EventGroup.destroy({
    where: {
      id: {$eq: eventGroupId}
    }
  })
  if (rowsDeleted === 1) {
    return true
  } else {
    return false
  }
}

module.exports = {
  createEventGroup,
  deleteEventGroup,
}