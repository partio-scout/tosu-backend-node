const scoutRouter = require('express').Router()
const request = require('request')
const axios = require('axios')

const models = require('../domain/models')
const verifyService = require('../services/verifyService')
const scoutService = require('../services/scoutService')

// Login with GoogleIdToken sent from the client
scoutRouter.post('/', async (req, res) => {
  const idTokenString = req.body.Authorization
  const idToken = await verifyService.verifyId(idTokenString)

  if (!idToken) {
    return res.status(403).send('Unable to verify idToken')
  }

  const scout = await scoutService.findOrCreateScout(idToken)
  req.session.scout = scout
  res.status(200).json(scout)
})

scoutRouter.post('/logout', async (req, res) => {
  req.session = null
  res.status(200).send('Logout successful')
})

module.exports = scoutRouter
