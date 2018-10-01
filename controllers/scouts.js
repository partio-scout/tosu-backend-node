const scoutRouter = require('express').Router()
const request = require('request')
const axios = require('axios')

const models = require('../domain/models')

scoutRouter.post('/', async (req, res) => {
  const idToken = req.body.Authorization
  // TODO: Verify idToken with GoogleIdTokenVerifier
  const scout = await models.Scout.findOrCreate({
    where: { googleId: idToken },
    defaults: { name: '' } // TODO: set name from verified GoogleIdToken
  }).spread((user, created) => user) // user: first found result, created: whether user was created or found

  req.session.scout = scout
  res.send(scout)
})

// test session
// scoutRouter.get('/session', async (req, res) => {
//   res.send(req.session.scout)
// })

module.exports = scoutRouter
