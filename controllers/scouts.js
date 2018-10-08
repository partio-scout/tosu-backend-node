const scoutRouter = require('express').Router()
const request = require('request')
const axios = require('axios')

const models = require('../domain/models')
const verifyService = require('../services/verifyService')
const scoutService = require('../services/scoutService')

// Login with GoogleIdToken
scoutRouter.post('/', async (req, res) => {
  const idTokenString = req.body.Authorization
  const idToken = await verifyService.verifyId(idTokenString)
  const scout = await scoutService.findOrCreateScout(idToken)

  req.session.scout = scout
  res.status(200).send(scout)
})

module.exports = scoutRouter
