const models = require('../domain/models')


// Returns a list of all scouts events
async function getAllEvents(scoutId) {
  const event = await models.Event.findAll({
    where:{
      scoutId: {$eq:scoutId}
    }
  })
  return event
}

// Returns an event
async function getEvent(eventId) {
  return await models.Event.findById(eventId)
}

//Creates a new event and returns it
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

//Updates an event and returns the updated event
async function updateEvent(eventId, newEvent) {
  const event = await models.Event.findById(eventId)
  if (event === null){
    return {error : 'Event was not found'}
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
    if (updated[0] !== 1){ //Should actually never happen
      console.log('Some nasty and weird error occurred when updating an event', updated)
      return {error : 'Something went wrong o_O'}
    }
    const updatedEvent = await models.Event.findById(event.id)
    return updatedEvent
  }
}

// Deletes an event
async function deleteEvent(eventId) {
  const rowsDeleted = await models.Event.destroy({
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
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent
}