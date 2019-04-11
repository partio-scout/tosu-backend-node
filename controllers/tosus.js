const tosuRouter = require('express').Router()
const verifyService = require('../services/verifyService')
const tosuService = require('../services/tosuService')

// Get all Tosus as an Array
tosuRouter.get('', (req, res) => {
  return tosuService
    .getAll(req.session.scout.id)
    .then(allTosus => res.status(200).json(allTosus))
})

// Create new Tosu and return it
tosuRouter.post('/:tosuName', async (req, res) => {
  const scout = req.session.scout
  const tosuName = req.params.tosuName
  if (tosuName === '') {
    return res.status(400).send('Tosu name can not be empty')
  }
  tosuService
    .create(scout.id, tosuName)
    .then(newTosu => res.status(201).json(newTosu))
})

// Edit a Tosu and return the new version
tosuRouter.put('/:tosuId', async (req, res) => {
  const scout = req.session.scout
  const tosuId = parseInt(req.params.tosuId)
  if (isNaN(tosuId)) {
    return res.status(400).send('Invalid Tosu name')
  }
  const owns = await verifyService.scoutOwnsTosu(scout.id, tosuId)
  if (!owns) {
    return res.status(403).send("You don't own this Tosu")
  }
  tosuService
    .update(tosuId, req.body)
    .then(editedTosu => res.status(200).json(editedTosu))
})

// Change selected Tosu
tosuRouter.put('/select/:tosuId', async (req, res) => {
  const scout = req.session.scout
  const tosuId = parseInt(req.params.tosuId)
  if (isNaN(tosuId)) {
    return res.status(400).send('Invalid Tosu id')
  }
  const owns = await verifyService.scoutOwnsTosu(scout.id, tosuId)
  if (!owns) {
    return res.status(403).send("You don't own this Tosu")
  }
  tosuService
    .select(scout.id, tosuId)
    .then(selectedTosu => res.status(200).json(selectedTosu))
})

// Delete a Tosu
tosuRouter.delete('/:tosuId', async (req, res) => {
  const scout = req.session.scout
  if (!req.session.scout) return res.status(401).send('Authorization needed')
  const tosuId = parseInt(req.params.tosuId)
  if (isNaN(tosuId)) {
    return res.status(400).send('Invalid Tosu id')
  }
  const owns = await verifyService.scoutOwnsTosu(scout.id, tosuId)
  if (!owns) {
    return res.status(403).send("You don't own this Tosu")
  }
  tosuService.remove(tosuId).then(() => res.status(204).send())
})

tosuRouter.get('/pdf/:tosuId', async (req, res) => {
  const scout = req.session.scout
  if (!scout) return res.status(401).send('Authorization needed')
  const tosuId = parseInt(req.params.tosuId)
  if (isNaN(tosuId)) {
    return res.status(400).send('Invalid Tosu id')
  }
  const owns = await verifyService.scoutOwnsTosu(scout.id, tosuId)
  if (!owns) {
    return res.status(403).send("You don't own this Tosu")
  } else {
    tosuService.pdf(tosuId, res)
  }
})

module.exports = tosuRouter
