const models = require('../domain/models')

const CLIENT_ID = '7360124073-8f1bq4mul415hr3kdm154vq3c65lp36d.apps.googleusercontent.com'

const { OAuth2Client } = require('google-auth-library')
const client = new OAuth2Client(CLIENT_ID)

// Verify token as a GoogleIdToken.
// Unsuccessful verification returns null.
// https://developers.google.com/identity/sign-in/web/backend-auth
async function verifyId(token) {
  let ticket = null
  try {
    ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
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
  //const domain = payload['hd'];

  return ticket
}

// Check that scout owns the activity (activity.event/buffer.scoutId = scout.id)
async function scoutOwnsActivity(scout, activityId) {
  const activity = await models.Activity.findById(activityId, { include: [models.Event, models.ActivityBuffer] })

  if (!activity || !scout) {
    return false
  }
  if (activity.Event && activity.Event.scoutId === scout.id) {
    return true
  }
  if (activity.ActivityBuffer && activity.ActivityBuffer.scoutId === scout.id) {
    return true
  }
  return false
}

// Check that scout owns the event
async function scoutOwnsEvent(scout, eventId) {
  const event = await models.Event.findById(eventId)
  if (scout && event && event.scoutId === scout.id){
    return true
  }
  return false
}

module.exports = {
  scoutOwnsActivity,
  verifyId,
  scoutOwnsEvent
}
