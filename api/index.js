const express = require('express')
const app = express()
const cors = require('cors')
const cookieParser = require('cookie-parser')

const spotify = require('./spotify')
app.use(spotify)

app.use(cors)
app.use(cookieParser)

if (require.main === module) {
  const port = 3001
  app.listen(port, () => {
    console.log(`API server listening on port ${port}`)
  })
}

module.exports = app
