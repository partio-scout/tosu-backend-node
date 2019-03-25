const models = require('../domain/models')

// Returns a frontend-friendly version of the buffer
// with activities and lower case attributes.
async function prepareBuffer(sequelizeBuffer) {
  if (sequelizeBuffer === null) return null
  const buffer = await models.ActivityBuffer.findById(sequelizeBuffer.id, {
    include: [models.Activity],
  })
  return {
    id: buffer.id,
    activities: await prepareActivities(buffer.Activities), // change to lower case
  }
}

// Returns a frontend-friendly version of the activity
async function prepareActivity(sequelizeActivity) {
  if (sequelizeActivity === null) return null
  const activity = await models.Activity.findById(sequelizeActivity.id, {
    include: [models.Plan],
  })
  activity.dataValues.plans = activity.dataValues.Plans
  delete activity.dataValues.Plans
  return activity.dataValues
}

// Returns a frontend-friendly versions of an array of activities
async function prepareActivities(activities) {
  for (var i = 0; i < activities.length; i++) {
    activities[i] = await prepareActivity(activities[i])
  }
  return activities
}

// Returns a frontend-friendly version of the event
// with activities and lower case attributes.
async function prepareEvent(sequelizeEvent) {
  if (sequelizeEvent === null) return null
  const event = await models.Event.findById(sequelizeEvent.id, {
    include: [{ model: models.Activity }],
  })
  event.dataValues.activities = await prepareActivities(
    event.dataValues.Activities
  )
  delete event.dataValues.Activities
  // Used by frontend to determine if the event is coming from the database
  // and needs to be synced with Kuksa:
  if (event.dataValues.kuksaEventId) {
    event.dataValues.synced = true
  }
  return event.dataValues
}

async function prepareEvents(events) {
  for (var i = 0; i < events.length; i++) {
    events[i] = await prepareEvent(events[i])
  }
  return events
}

module.exports = {
  prepareBuffer,
  prepareActivity,
  prepareActivities,
  prepareEvent,
  prepareEvents,
}
