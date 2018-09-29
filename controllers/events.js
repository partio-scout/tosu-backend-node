const eventRouter = require('express').Router()
const request = require('request')
const axios = require('axios')

const models = require('../domain/models')

eventRouter.get('/test', async (req, res) => {
  console.log("lol")
  res.status(200).send('Yes')
})

module.exports = eventRouter
