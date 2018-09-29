const activityRouter = require('express').Router()
const request = require('request')
const axios = require('axios')

const models = require('../domain/models')

// TODO: check for logged in

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

activityRouter.get('/:activityId/tobuffer', async (req, res) => {
  const scout = req.session.scout
  const activityId = parseInt(req.params.activityId)

  const buffer = await models.ActivityBuffer.findOne({
    where: { scoutId: scout.id }
  })
  const activity = await models.Activity.findById(activityId)
  await activity.update({ eventId: null })
  await activity.update({ activityBufferId: buffer.id })
})

module.exports = activityRouter
