const pofRouter = require('express').Router()
const request = require('request')
const axios = require('axios')
var cache = require('memory-cache')
var cron = require('node-cron')
const data = require('../pof.json')

const options = {
  root: './'
}

pofRouter.get('/', async (req, res) => {
  res.send('Hello world, Hei maailma')
})

pofRouter.get('/delete', async (req, res) => {
  cache.del('filledpof')
  res.redirect('/filledpof')
})

pofRouter.get('/tarppo', async (req, res) => {
  const cached = cache.get('filledpof')
  if (cached != null) {
    console.log('cache')
    res.json(JSON.parse(cached))
  } else {
    makeFilledPof(false, 'fd0083b9a325c06430ba29cc6c6d1bac')
    res.json(data)
  }
})

async function makeFilledPof(res, guid) {
  const agegroup = await getContent(guid)
  taskDetails(agegroup)
  async function taskDetails(agegroup) {
    for (const taskgroup of agegroup.taskgroups) {
      if (taskgroup.taskgroups.length > 0) {
        console.log('--------------PAUSSIT--------------')
        for (const paussigroup of taskgroup.taskgroups) {
          for (const suhde of paussigroup.taskgroups) {
            for (const paussi of suhde.tasks) {
              const details = await getTaskDetails(paussi)
              Object.assign(paussi, details)
              paussi.suggestions_details = await getSuggestions(paussi)
              console.log('   ' + paussi.title)
            }
          }
        }
      } else {
        for (const task of taskgroup.tasks) {
          const details = await getTaskDetails(task)
          Object.assign(task, details)
          task.suggestions_details = await getSuggestions(task)
          console.log(task.title)
        }
      }
    }
    //suggestions(true)
    const date = new Date().toISOString()
    agegroup['updateDate'] = date
    cache.put('filledpof', JSON.stringify(agegroup))
    if (res) {
      res.json(agegroup)
    }
  }
  async function suggestions(send) {
    for (const taskgroup of tarpojat.taskgroups) {
      for (const task of taskgroup.tasks) {
        task.suggestions_details = await getSuggestions(task)
      }
    }
    if (send) {
      res.json(tarpojat)
    }
  }
}

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

const getContent = async guid => {
  const url = 'https://pof-backend.partio.fi/spn-ohjelma-json-taysi'
  try {
    const response = await axios.get(url)
    const data = response.data
    for (const age of data.program[0].agegroups) {
      if (age.guid === guid) {
        const agegroup = age
        console.log(agegroup.title)
        return agegroup
        break
      }
    }
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

cron.schedule('0 2 * * *', () => {
  makeFilledPof(false, 'fd0083b9a325c06430ba29cc6c6d1bac')
})

module.exports = pofRouter
