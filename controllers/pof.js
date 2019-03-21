const pofRouter = require('express').Router()
const axios = require('axios')
var cache = require('memory-cache')
var cron = require('node-cron')
const jsonfile = require('jsonfile')
var path = require('path')
var makingPof = false

pofRouter.get('/', async (req, res) => {
  res.json({
    makingPof: makingPof,
  })
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
    if (!makingPof) {
      makeFilledPof(false, 'fd0083b9a325c06430ba29cc6c6d1bac')
    }
    res.sendFile(path.resolve('pof.json'), function(err) {
      if (err) {
        res.status(409).send('generating pof, wait a sec')
      }
    })
  }
})

pofRouter.get('/test', async (req, res) => {
  makeFilledPof(res, 'fd0083b9a325c06430ba29cc6c6d1bac', true)
})

async function makeFilledPof(res, guid, test) {
  console.log('START MAKING POF')
  makingPof = true
  const agegroup = await getContent(guid, test)
  await taskDetails(agegroup)
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
    agegroup['updateDate'] = new Date().toISOString()
    if (!test) {
      jsonfile.writeFile('pof.json', agegroup, { spaces: 2 })
    }
    cache.put('filledpof', JSON.stringify(agegroup))
    makingPof = false
    if (res) {
      res.json(agegroup)
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

const getContent = async (guid, test) => {
  const url = 'https://pof-backend.partio.fi/spn-ohjelma-json-taysi'
  try {
    const response = await axios.get(url)
    const data = response.data
    for (const age of data.program[0].agegroups) {
      if (age.guid === guid) {
        const agegroup = age
        //console.log(agegroup.title)
        if (test) {
          agegroup.taskgroups = agegroup.taskgroups.slice(6, 8)
          agegroup.taskgroups[0].tasks = agegroup.taskgroups[0].tasks.slice(
            0,
            2
          )
          agegroup.taskgroups[1].taskgroups = agegroup.taskgroups[1].taskgroups.slice(
            0,
            1
          )
          agegroup.taskgroups[1].taskgroups[0].taskgroups = agegroup.taskgroups[1].taskgroups[0].taskgroups.slice(
            0,
            1
          )
          agegroup.taskgroups[1].taskgroups[0].taskgroups[0].tasks = agegroup.taskgroups[1].taskgroups[0].taskgroups[0].tasks.slice(
            0,
            1
          )
        }
        return agegroup
      }
    }
  } catch (error) {
    return ''
  }
}

cron.schedule('0 2 * * *', () => {
  makeFilledPof(false, 'fd0083b9a325c06430ba29cc6c6d1bac')
})

module.exports = pofRouter
