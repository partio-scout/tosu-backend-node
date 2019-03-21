const tosuRouter = require('express').Router()
const verifyService = require('../services/verifyService')
const tosuService = require('../services/tosuService')

// Get all Tosus
tosuRouter.get('', (req, res) =>
  tosuService
    .getAll(req.session.scout.id)
    .then(allTosus => res.status(200).json(allTosus))
)

// Create new Tosu and return it
tosuRouter.post('/:tosuName', (req, res) => {
  const scout = req.session.scout
  const tosuName = req.params.tosuName
  if (isNaN(tosuName)) {
    return res.status(400).send('Invalid Tosu name')
  }
  tosuService
    .create(scout.id, tosuName)
    .then(newTosu => res.status(201).json(newTosu))
})

// Edit a Tosu and return the new version
tosuRouter.put('/:tosuId', (req, res) => {
  const scout = req.session.scout
  const tosuId = parseInt(req.params.tosuId)
  if (isNaN(tosuId)) {
    return res.status(400).send('Invalid Tosu name')
  }
  if (!verifyService.scoutOwnsTosu(scout.id, tosuId)) {
    return res.status(403).send("You don't own this Tosu")
  }
  tosuService
    .update(tosuId, req.body)
    .then(editedTosu => res.status(200).json(editedTosu))
})

// Change selected Tosu for a scout
tosuRouter.put('/select/:tosuId', (req, res) => {
  const scout = req.session.scout
  const tosuId = parseInt(req.params.tosuId)
  if (isNaN(tosuId)) {
    return res.status(400).send('Invalid Tosu name')
  }
  if (!verifyService.scoutOwnsTosu(scout.id, tosuId)) {
    return res.status(403).send("You don't own this Tosu")
  }
  tosuService
    .select(scout.id, tosuId)
    .then(selectedTosu => res.status(200).json(selectedTosu))
})

// Delete a Tosu
tosuRouter.delete('/:tosuId', (req, res) => {
  const scout = req.session.scout
  const tosuId = parseInt(req.params.tosuId)
  if (isNaN(tosuId)) {
    return res.status(400).send('Invalid Tosu id')
  }
  if (!verifyService.scoutOwnsTosu(scout.id, tosuId)) {
    return res.status(403).send("You don't own this Tosu")
  }
  tosuService.remove(tosuId).then(() => res.status(204).send())
})

module.exports = tosuRouter
