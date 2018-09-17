const pofRouter = require('express').Router()
const request = require('request')

pofRouter.get('/', async (req, res) => {
    res.send('Hello world')
})

pofRouter.get('/full', async (req, res) => {
    request.get({
        uri: 'https://pof-backend.partio.fi/spn-ohjelma-json-taysi',
        strictSSL: false
    }, function (error, response, body) {
        if (error == null) {
            const json = JSON.parse(body)
        }
    })
})

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