const activityRouter = require('express').Router()
const request = require('request')
const axios = require('axios')

const models = require('../domain/models')
const verifyService = require('../services/verifyService')
const activityService = require('../services/activityService')

// TODO: check for logged in

// Delete Activity
activityRouter.delete('/:activityId', async (req, res) => {
  const scout = req.session.scout
  const activityId = parseInt(req.params.activityId)

  if (! await verifyService.scoutOwnsActivity(scout, activityId)) {
    return res.status(403).send('You are not the owner of this activity.')
  }

  if (! await activityService.deleteActivity(activityId)) {
    console.log('Deleted activity with ID', activityId)
    res.status(200).send('Deleted')
  } else {
    console.log('Did not delete activity with ID', activityId)
    res.status(404).send('Did not delete')
  }
})

// Move Activity from Event to Buffer
activityRouter.put('/:activityId/tobuffer', async (req, res) => {
  const scout = req.session.scout
  const activityId = parseInt(req.params.activityId)

  if (! await verifyService.scoutOwnsActivity(scout, activityId)) {
    return res.status(403).send('You are not the owner of this activity.')
  }

  var movedActivity = await activityService.moveActivityFromEventToBuffer(activityId, scout)

  if (movedActivity.error) {
    res.status(500).send(movedActivity.error)
  } else {
    res.status(200).send(movedActivity)
  }
})

// Move Activity from Buffer to Event
activityRouter.put('/:activityId/toevent/:eventId', async(req, res) => {
  const scout = req.session.scout
  const activityId = parseInt(req.params.activityId)
  const eventId = parseInt(req.params.eventId)

  if (! await verifyService.scoutOwnsActivity(scout, activityId)) {
    return res.status(403).send('You are not the owner of this activity.')
  }

  var movedActivity = await activityService.moveActivityFromBufferToEvent(activityId, eventId)

  if (movedActivity.error) {
    res.status(500).send(movedActivity.error)
  } else {
    res.status(200).send(movedActivity)
  }
})

module.exports = activityRouter
