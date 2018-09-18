const pofRouter = require('express').Router()
const request = require('request')
const axios = require('axios')
var cache = require('memory-cache')
var cron = require('node-cron');

pofRouter.get('/', async (req, res) => {
  res.send('Hello world')
})

pofRouter.get('/tarppo', async (req, res) => {
  const cached = cache.get('filledpof')
  if (cached != null) {
    console.log('cache')
    res.json(JSON.parse(cached))
  } else {
    makeFilledPof(res)
  }
})

async function makeFilledPof(res) {
  const url = 'https://pof-backend.partio.fi/spn-ohjelma-json-taysi'
  const data = await getContent(url)
  const tarpojat = data.program[0].agegroups[2]
  taskDetails(tarpojat)
  async function taskDetails() {
    for (const taskgroup of tarpojat.taskgroups) {
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
    cache.put('filledpof', JSON.stringify(tarpojat))
    if (res) {
      res.json(tarpojat)
    }

  }
  async function taskDetails(tarpojat) {
    for (const taskgroup of tarpojat.taskgroups) {
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
    tarpojat['updateDate'] = date
    cache.put('filledpof', JSON.stringify(tarpojat))
    res.json(tarpojat)
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

cron.schedule('0 2 * * *', () => {
  makeFilledPof()
})

module.exports = pofRouter
