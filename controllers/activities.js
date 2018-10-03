const activityRouter = require('express').Router()
const request = require('request')
const axios = require('axios')

const models = require('../domain/models')

// TODO: check for logged in

// Delete Activity
activityRouter.delete('/:activityId', async (req, res) => {
  const activityId = parseInt(req.params.activityId)

  models.Activity.destroy({
    where: {
      id: { $eq: activityId }
    }
  }).then(rowsDeleted => {
    if (rowsDeleted === 1) {
      console.log('Deleted activity with ID', req.params.activityId)
      res.status(200).send('Deleted')
    } else {
      console.log('Did not delete activity with ID', req.params.activityId)
      res.status(404).send('Not deleted')
    }
  })
})

// Move Activity from Event to Buffer
activityRouter.put('/:activityId/tobuffer', async (req, res) => {
  const scout = req.session.scout
  const activityId = parseInt(req.params.activityId)

  const buffer = await models.ActivityBuffer.findOne({
    where: { scoutId: scout.id }
  })
  const activity = await models.Activity.findById(activityId)
  await activity.update({ eventId: null })
  await activity.update({ activityBufferId: buffer.id })
  await activity.reload()
  res.status(200).send(activity)
})

// Move Activity from Buffer to Event
activityRouter.put('/:activityId/toevent/:eventId', async(req, res) => {
  const scout = req.session.scout
  const activityId = parseInt(req.params.activityId)
  const eventId = parseInt(req.params.eventId)
  const activity = await models.Activity.findById(activityId)

  const buffer = await models.ActivityBuffer.findOne({
    where: {
      scoutId: { $eq: scout.id }
    }
  })

  // Check that scout owns the buffer and activity
  if (activity.activityBufferId !== buffer.id) {
    return res.status(403).send('You are not the owner of this activity.')
  }

  // Check that event exists
  const event = await models.Event.findById(eventId)
  if (!event) {
    return res.status(403).send('Event does not exist.')
  }

  await activity.update({ activityBufferId: null })
  await activity.update({ eventId: eventId })
  res.status(200).send(activity)
})

module.exports = activityRouter
