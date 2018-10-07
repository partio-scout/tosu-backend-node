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


// Check that scout owns the plan
async function scoutOwnsPlan(scout, planId) {
  const plan = await models.Plan.findById(
    planId,
    { 
      include: [{
        model : models.Activity,
        include: [models.Event, models.ActivityBuffer]
      }]
    }
  )
  if (!scout || !plan || !plan.Activity){
    return false
  }
  if (plan.Activity.Event && plan.Activity.Event.scoutId === scout.id) {
    return true
  }
  if (plan.Activity.ActivityBuffer && plan.Activity.ActivityBuffer.scoutId === scout.id) {
    return true
  }
  console.log("CASE 2")
  return false
}

module.exports = {
  scoutOwnsActivity,
  scoutOwnsEvent,
  scoutOwnsPlan
}
