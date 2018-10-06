const models = require('../domain/models')


async function getAllEvents(scoutId) {
  const event = await models.Event.findAll({
    where:{
      scoutId: {$eq:scoutId}
    }
  })
  return event
}

async function createEvent(scoutId, newEvent) {
  const event = await models.Event.create({
    title: newEvent.title,
    startDate: newEvent.startDate,
    startTime: newEvent.startTime,
    endDate: newEvent.endDate,
    endTime: newEvent.endTime,
    type: newEvent.type,
    information: newEvent.information,
    scoutId: scoutId
  })
  return event
}

async function updateEvent(eventId, newEvent) {
  // This function returns the updated element only, TODO: proper error handling
  const event = await models.Event.findById(eventId)
  if (event === null){
    return {}
  }else{
    const updated = await models.Event.update(
      {
        title: newEvent.title,
        startDate: newEvent.startDate,
        startTime: newEvent.startTime,
        endDate: newEvent.endDate,
        endTime: newEvent.endTime,
        type: newEvent.type,
        information: newEvent.information
      }, 
      {
        where: {
          id: {$eq: event.id}
        }
      }
    )
    if (updated[0] !== 1){
      console.log('Some weird error happened when updating and event!!!!11', updated)
    }
    const updatedEvent = await models.Event.findById(event.id)
    return updatedEvent
  }
}
async function deleteEvent(eventId) {
  const rowsDeleted = await models.Activity.destroy({
    where: {
      id: { $eq: eventId }
    }
  })
  if (rowsDeleted === 1) {
    return true
  } else {
    return false
  }
}

module.exports = {
  getAllEvents,
  createEvent,
  updateEvent,
  deleteEvent
}