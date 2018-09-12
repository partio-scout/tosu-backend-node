const express = require('express')
const request = require('request')
const cors = require('cors')
const app = express()

var corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true
}

app.use(cors(corsOptions))

app.get('/api', (req, res) => {
  request.get({
    uri: 'https://pof-backend.partio.fi/spn-ohjelma-json-taysi',
    strictSSL: false
  }).pipe(res)
})

app.get('/filledpof/tarppo', (req, res) => {
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
        statics.tarpot.push({name: name, total: aktiviteetit.length})
      }
      res.send(statics)
    }
  })
})

app.get('/hello', (req, res) => {
  res.end('Hello world')
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})