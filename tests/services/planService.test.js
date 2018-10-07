const models = require('../../domain/models')
const planService = require('../../services/planService')
require('../handleTestDatabase')

var scout

beforeEach(async () => {
  scout = await models.Scout.create()
})
