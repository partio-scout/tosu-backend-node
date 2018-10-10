const models = require('../domain/models')

// Deletes Activity.
// Returns true if deleted, false if no rows deleted.
async function deleteActivity(activityId) {
  await models.Activity.destroy({
    where: {
      id: { $eq: activityId }
    }
  }).then(rowsDeleted => {
    if (rowsDeleted === 1) {
      return true
    } else {
      return false
    }
  })
}

// Moves Activity from Event to the Scout's ActivityBuffer.
// Returns moved Activity if successful, errorObject containing an error message if failed to move.
async function moveActivityFromEventToBuffer(activityId, scout) {
  const activity = await models.Activity.findById(activityId)
  const buffer = await models.ActivityBuffer.findOne({
    where: {
      scoutId: { $eq: scout.id }
    }
  })

  // Buffer or Activity not found.
  if (!buffer) return { error: 'Buffer was not found.' }
  if (!activity) return { error: 'Activity was not found.' }

  await activity.update({ eventId: null })
  await activity.update({ activityBufferId: buffer.id })
  await activity.reload()
  return activity
}

// Moves Activity from the Scout's ActivityBuffer to Event.
// Returns moved Activity if successful, errorObject containing an error message if failed to move.
async function moveActivityFromBufferToEvent(activityId, eventId) {
  const activity = await models.Activity.findById(activityId)
  const event = await models.Event.findById(eventId)

  // Event or Activity not found
  if (!event) return { error: 'Event does not exist.' }
  if (!activity) return { error: 'Activity does not exist.' }

  await activity.update({ activityBufferId: null })
  await activity.update({ eventId: eventId })
  return activity
}

// Adds a Plan to the Activity
// Returns the added plan if successful, errorObject containing an error message if failed.
async function addPlanToActivity(activityId, plan) {
  const createdPlan = await models.Plan.create(plan)
  const activity = await models.Activity.findById(activityId)

  if (!createdPlan) return { error: 'Could not create plan from given data.' }
  if (!activity) return { error: 'Activity does not exist.' }

  await createdPlan.update({ activityId: activityId })
  return createdPlan
}

module.exports = {
  deleteActivity,
  moveActivityFromEventToBuffer,
  moveActivityFromBufferToEvent,
  addPlanToActivity,
}
