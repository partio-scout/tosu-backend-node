const models = require('../domain/models')

// Check that scout owns the activity (activity.event/buffer.scoutId = scout.id)
async function scoutOwnsActivity(scout, activityId) {
  const activity = await models.Activity.findById(activityId, { include: [models.Event, models.ActivityBuffer] })

  if (!activity || !scout) {
    return false
  }
  if (activity.Event && activity.Event.scoutId === scout.id) {
    return true
  }
  if (activity.ActivityBuffer && activity.ActivityBuffer.scoutId === scout.id) {
    return true
  }
  return false
}

// Check that scout owns the event
async function scoutOwnsEvent(scout, eventId) {
  const event = await models.Event.findById(eventId)
  if (scout && event && event.scoutId === scout.id){
    return true
  }
  return false
}

module.exports = {
  scoutOwnsActivity,
  scoutOwnsEvent
}
