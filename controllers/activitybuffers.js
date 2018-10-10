const activityBufferRouter = require('express').Router()
const bufferService = require('../services/activitybufferService')

// TODO: check for logged in

// Return the buffer of the logged in scout
activityBufferRouter.get('/', async (req, res) => {
  const scout = req.session.scout
  const buffer = await bufferService.findByScout(scout)
  res.json(buffer)
})

// Add an activity to the scout's buffer
activityBufferRouter.post('/activity', async (req, res) => {
  const scout = req.session.scout
  const activity = req.body

  const addedActivity = await bufferService.addActivityToBuffer(activity, scout)

  if (addedActivity.errors) {
    return res.status(500).send(addedActivity.error)
  }

  res.status(201).json(addedActivity)
})

module.exports = activityBufferRouter
