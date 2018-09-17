const pofRouter = require('express').Router()
const request = require('request')
const axios = require('axios')

pofRouter.get('/', async (req, res) => {
  res.send('Hello world')
})

pofRouter.get('/full', async (req, res) => {
  const url = 'https://pof-backend.partio.fi/spn-ohjelma-json-taysi'
  const data = await getContent(url)
  const tarpojat = data.program[0].agegroups[2]
  async function taskDetails() {
    for (const taskgroup of tarpojat.taskgroups) {
      for (const task of taskgroup.tasks) {
        const details = await getTaskDetails(task)
        Object.assign(task, details)
      }
    }
    suggestions()
  }
  async function suggestions() {
    for (const taskgroup of tarpojat.taskgroups) {
      for (const task of taskgroup.tasks) {
        task.suggestions_details = await getSuggestions(task)
      }
    }
    res.json(tarpojat)
  }
  taskDetails()
})

const getSuggestions = async task => {
  try {
    const response = await axios.get(task.suggestions_details[0].details)
    const data = response.data.items
    return data
  } catch (error) {
    return []
  }
}

const getTaskDetails = async task => {
  try {
    const response = await axios.get(task.languages[0].details)
    const data = response.data
    return data
  } catch (error) {
    return null
  }
}

const getContent = async url => {
  try {
    const response = await axios.get(url)
    const data = response.data
    return data
  } catch (error) {
    return ''
  }
}


pofRouter.get('/tarppo', (req, res) => {
  request.get({
    uri: 'https://pof-backend.partio.fi/spn-ohjelma-json-taysi',
    strictSSL: false
  }, function (error, response, body) {
    if (error == null) {
      const json = JSON.parse(body)
      var tarpojat = json.program[0].agegroups[2]
      var statics = {
        tarppoja: tarpojat.taskgroups.length,
        tarpot: []
      }
      for (let i = 0; i < tarpojat.taskgroups.length; i++) {
        var tarppo = tarpojat.taskgroups[i]
        var name = tarppo.languages[0].title
        var aktiviteetit = tarppo.tasks
        statics.tarpot.push({ name: name, total: aktiviteetit.length })
      }
      res.json(statics)
    }
  })
})

module.exports = pofRouter