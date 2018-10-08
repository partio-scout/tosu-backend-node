const eventgroupRouter = require('express').Router()
const request = require('request')
const axios = require('axios')

eventgroupRouter.post('/', async (req,res) => {
  res.send('eventgoup')
})

eventgroupRouter.delete('/:id', async (req,res) => {
  const id = req.params.id
  res.send(id)
})

module.exports = eventgroupRouter