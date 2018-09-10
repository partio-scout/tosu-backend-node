const express = require('express')
const app = express()
const request = require('request')

app.get('/api', (req, res) => {
  request.get({
    uri: 'https://pof-backend.partio.fi/spn-ohjelma-json-taysi',
    strictSSL: false
  }).pipe(res)
})

app.get('/api/tarpojat', (req, res) => {
  request.get({
    uri: 'https://pof-backend.partio.fi/spn-ohjelma-json-taysi',
    strictSSL: false
  }, function (error, response, body) {
    if (error == null) {
      const json = JSON.parse(body);
      res.send(json.program[0].agegroups[2]);
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