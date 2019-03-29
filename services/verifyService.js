const models = require('../domain/models')

const CLIENT_ID =
  '1059818174105-9p207ggii6rt2mld491mdbhqfvor2poc.apps.googleusercontent.com'

const { OAuth2Client } = require('google-auth-library')
const client = new OAuth2Client(CLIENT_ID)

/**
 * Verify token as a GoogleIdToken.
 * Unsuccessful verification returns null.
 * https://developers.google.com/identity/sign-in/web/backend-auth
 * @param {*} token Google token
 * @returns Ticket or null
 */
const verifyId = async token => {
  let ticket = null
  try {
    ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    })
  } catch (e) {
    console.log('Could not verify idToken:', e)
    return null
  }
  const payload = ticket.getPayload()
  const userid = payload['sub']
  // If request specified a G Suite domain:
  //const domain = payload['hd']

  return ticket
}

// Check that scout owns the activity (activity.event/buffer.scoutId = scout.id)
const scoutOwnsActivity = async (scout, activityId) => {
  const activity = await models.Activity.findById(activityId, {
    include: [
      {
        model: models.Event,
        include: [models.Tosu],
      },
      models.ActivityBuffer,
    ],
  })
  if (!activity || !scout) {
    return false
  }
  if (activity.Event && activity.Event.Tosu.scoutId === scout.id) {
    return true
  }
  if (activity.ActivityBuffer && activity.ActivityBuffer.scoutId === scout.id) {
    return true
  }
  return false
}

// Check that scout owns the event
const scoutOwnsEvent = async (scout, eventId) => {
  const event = await models.Event.findById(eventId, {
    include: [models.Tosu],
  })
  if (scout && event && event.Tosu.scoutId === scout.id) {
    return true
  }
  return false
}

// Check that scout owns the plan
const scoutOwnsPlan = async (scout, planId) => {
  const plan = await models.Plan.findById(planId, {
    include: [
      {
        model: models.Activity,
        include: [models.Event, models.ActivityBuffer],
      },
    ],
  })
  if (!scout || !plan || !plan.Activity) {
    return false
  }
  if (plan.Activity.Event && plan.Activity.Event.scoutId === scout.id) {
    return true
  }
  if (
    plan.Activity.ActivityBuffer &&
    plan.Activity.ActivityBuffer.scoutId === scout.id
  ) {
    return true
  }
  return false
}

/**
 * Check that scout owns the Tosu
 * @param scoutId - The ID of the scout
 * @param tosuId - The ID of the Tosu
 * @returns true if scout owns the Tosu, otherwise false
 */
const scoutOwnsTosu = (scoutId, tosuId) =>
  models.Tosu.findById(tosuId).then(tosu => tosu.scoutId === scoutId)

// Checks whether the scout is logged in.
// TODO: Other checks than just querying database?
async function isLoggedIn(scout) {
  if (!scout) {
    return false
  }
  return (await models.Scout.findById(scout.id)) !== null
}

module.exports = {
  verifyId,
  scoutOwnsActivity,
  scoutOwnsEvent,
  scoutOwnsPlan,
  scoutOwnsTosu,
  isLoggedIn,
}
