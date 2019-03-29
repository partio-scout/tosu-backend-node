const activityRouter = require('express').Router()

const verifyService = require('../services/verifyService')
const activityService = require('../services/activityService')

// TODO: check for logged in

// Delete Activity
activityRouter.delete('/:activityId', async (req, res) => {
  const scout = req.session.scout
  const activityId = parseInt(req.params.activityId)

  if (isNaN(activityId)) {
    return res.status(400).send('Invalid activity id!')
  }

  if (!(await verifyService.scoutOwnsActivity(scout, activityId))) {
    return res.status(403).send('You are not the owner of this activity.')
  }

  if (!(await activityService.deleteActivity(activityId))) {
    console.log('Deleted activity with ID', activityId)
    res.send('Deleted')
  } else {
    console.log('Did not delete activity with ID', activityId)
    res.status(404).send('Did not delete')
  }
})

// Move Activity from Event to Buffer
activityRouter.put('/:activityId/tobuffer', async (req, res) => {
  const scout = req.session.scout
  const activityId = parseInt(req.params.activityId)

  if (isNaN(activityId)) {
    return res.status(400).send('Invalid activity id!')
  }

  if (!(await verifyService.scoutOwnsActivity(scout, activityId))) {
    return res.status(403).send('You are not the owner of this activity.')
  }

  const movedActivity = await activityService.moveActivityFromEventToBuffer(
    activityId,
    scout
  )

  sendResponse(res, movedActivity)
})

// Move Activity from Buffer to Event
activityRouter.put('/:activityId/toevent/:eventId', async (req, res) => {
  const scout = req.session.scout
  const activityId = parseInt(req.params.activityId)
  const eventId = parseInt(req.params.eventId)

  if (isNaN(activityId) || isNaN(eventId)) {
    return res.status(400).send('Invalid activity or event id!')
  }

  if (!(await verifyService.scoutOwnsActivity(scout, activityId))) {
    return res.status(403).send('You are not the owner of this activity.')
  }

  const movedActivity = await activityService.moveActivityFromBufferToEvent(
    activityId,
    eventId
  )

  sendResponse(res, movedActivity)
})

// Add Plan to Activity
activityRouter.post('/:activityId/plans', async (req, res) => {
  const scout = req.session.scout
  const activityId = parseInt(req.params.activityId)
  const plan = req.body

  if (isNaN(activityId)) {
    return res.status(400).send('Invalid activity id!')
  }

  if (!(await verifyService.scoutOwnsActivity(scout, activityId))) {
    return res.status(403).send('You are not the owner of this activity.')
  }

  // TODO: Validate (some?) of plan's attributes before adding it to the database?

  const addedPlan = await activityService.addPlanToActivity(activityId, plan)

  sendResponse(res, addedPlan)
})

// Checks if the object is an error message (has object.error)
// or sends the object as a 200 OK response.
function sendResponse(res, responseObject) {
  if (responseObject.error) {
    console.log('Error:', responseObject.error)
    res.status(500).send(responseObject.error)
  } else {
    res.json(responseObject)
  }
}

module.exports = activityRouter
