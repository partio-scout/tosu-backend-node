const models = require('../domain/models')
const prepareService = require('./prepareService')

// Returns a list of all scouts events
async function getAllEvents(scoutId) {
  const events = await models.Event.findAll({
    where: {
      scoutId: { $eq: scoutId },
    },
  })
  return await prepareService.prepareEvents(events)
}

// Returns an event
async function getEvent(eventId) {
  return await prepareService.prepareEvent(await models.Event.findById(eventId))
}

//Creates a new event and returns it
async function createEvent(scoutId, eventData) {
  eventData.scoutId = scoutId
  try {
    const event = await models.Event.create(eventData)
    return await prepareService.prepareEvent(event)
  } catch (error) {
    return { error: error }
  }
}

//Updates an event and returns the updated event
async function updateEvent(eventId, eventData) {
  try {
    const event = await models.Event.findById(eventId)
    if (event === null) {
      return { error: 'Event was not found' }
    }
    eventData.scoutId = event.scoutId
    const updated = await models.Event.update(eventData, {
      where: {
        id: { $eq: event.id },
      },
    })
    if (updated[0] !== 1) {
      //Should actually never happen
      console.log(
        'Some nasty and weird error occurred when updating an event',
        updated
      )
      return { error: 'Something went wrong o_O' }
    }
    const updatedEvent = await models.Event.findById(event.id)
    return await prepareService.prepareEvent(updatedEvent)
  } catch (error) {
    console.log(error)
    return { error: error }
  }
}

// Add activity to event
async function addActivityToEvent(eventId, activityData) {
  try {
    const event = await models.Event.findById(eventId)
    if (!event) {
      return { error: 'Event could not be found' }
    }
    const activity = await models.Activity.create(activityData)
    await activity.update({ activityBufferId: null })
    await activity.update({ eventId: eventId })
    return await prepareService.prepareActivity(activity)
  } catch (error) {
    return { error: error }
  }
}

// Deletes an event
async function deleteEvent(eventId) {
  try {
    const rowsDeleted = await models.Event.destroy({
      where: {
        id: { $eq: eventId },
      },
    })
    if (rowsDeleted === 1) {
      return true
    } else {
      return false
    }
  } catch (error) {
    console.log('Error in deleting event: ', error)
    return false
  }
}

module.exports = {
  getAllEvents,
  getEvent,
  createEvent,
  updateEvent,
  addActivityToEvent,
  deleteEvent,
}
