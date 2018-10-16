const models = require('../domain/models')


// Returns a list of all scouts events
async function getAllEvents(scoutId) {
  const events = await models.Event.findAll({
    where: {
      scoutId: { $eq : scoutId }
    }
  })
  return events
}

// Returns an event
async function getEvent(eventId) {
  return await models.Event.findById(eventId)
}

//Creates a new event and returns it
async function createEvent(scoutId, eventData) {
  eventData.scoutId=scoutId
  const event = await models.Event.create(eventData)
  return event
}

//Updates an event and returns the updated event
async function updateEvent(eventId, eventData) {
  const event = await models.Event.findById(eventId)
  if (event === null){
    return { error : 'Event was not found' }
  }
  eventData.scoutId = event.scoutId
  const updated = await models.Event.update(
    eventData,
    {
      where: {
        id: { $eq: event.id }
      }
    }
  )
  if (updated[0] !== 1) { //Should actually never happen
    console.log('Some nasty and weird error occurred when updating an event', updated)
    return { error : 'Something went wrong o_O' }
  }
  const updatedEvent = await models.Event.findById(event.id)
  return updatedEvent
}


// Add activity to event
async function addActivityToEvent(eventId, activityData) {
  const event = await models.Event.findById(eventId)
  if (!event){
    return {error: 'Event could not be found'}
  }
  const activity = await models.Activity.create(activityData)
  await activity.update({ activityBufferId: null })
  await activity.update({ eventId: eventId })
  return activity
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

// Returns a frontend-friendly version of the event
// with activities and lower case attributes.
async function prepareEvent(eventr) {
  const event = await models.Event.findById(eventr.id, {
    include: [{model: models.Activity, name: 'activities'}],
  })
  event.dataValues.activities = event.dataValues.Activities
  delete event.dataValues.Activities
  return event.dataValues
}

async function prepareEvents(events) {
  for (var i=0; i<events.length; i++){
    events[i] = await prepareEvent(events[i])
  }
  return events
}

module.exports = {
  getAllEvents,
  getEvent,
  createEvent,
  updateEvent,
  addActivityToEvent,
  deleteEvent,
  prepareEvent,
  prepareEvents,
}
