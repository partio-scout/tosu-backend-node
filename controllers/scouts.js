const scoutRouter = require('express').Router()
const request = require('request')
const axios = require('axios')

const models = require('../domain/models')

// Login with GoogleIdToken
scoutRouter.post('/', async (req, res) => {
  const idTokenString = req.body.Authorization
  // TODO: Verify idToken with GoogleIdTokenVerifier
  const idToken = idTokenString
  const scout = await models.Scout.findOrCreate({
    where: { googleId: idToken },
    defaults: { name: '' } // TODO: set name from verified GoogleIdToken
  }).spread((user, created) => user) // user: first found result, created: whether user was created or found

  req.session.scout = scout
  res.json(scout)
})

module.exports = scoutRouter
