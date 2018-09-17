let port = 3001

if (process.env.NODE_ENV === 'test') {
  port = 3002
}

module.exports = {
  port
}