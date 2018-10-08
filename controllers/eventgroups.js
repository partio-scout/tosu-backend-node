const eventgroupRouter = require('express').Router()
const request = require('request')
const axios = require('axios')
const models = require('../domain/models')

eventgroupRouter.post('/', async (req,res) => {
  const group = await models.EventGroup.create()
  res.json(group.id)
})

eventgroupRouter.delete('/:id', async (req,res) => {
  const id = req.params.id
  res.send(id)
})

module.exports = eventgroupRouter