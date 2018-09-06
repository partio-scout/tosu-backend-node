const express = require('express')
const app = express()
const request = require('request')

app.get('/', (req, res) => {
  request.get({
    uri: 'https://pof-backend.partio.fi/spn-ohjelma-json-taysi',
    strictSSL: false
  }).pipe(res)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})