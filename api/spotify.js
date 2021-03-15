/* eslint-disable no-console */
/* eslint-disable camelcase */
/* eslint-disable no-undef */

const querystring = require('querystring')
const { Router } = require('express')
const router = Router()
const request = require('request')
const axios = require('axios')
const cookieParser = require('cookie-parser')
const cors = require('cors')

const client_id = process.env.SPOTIFY_CLIENT_ID
const client_secret = process.env.SPOTIFY_CLIENT_SECRET
const redirect_uri = process.env.SPOTIFY_REDIRECT_URI
const baseUrl = 'https://api.spotify.com/v1'
const stateKey = 'spotify_auth_state'

let accessToken, refreshToken

router.use(cookieParser())
router.use(cors())

router.get('/login', function(req, res) {
  const state = generateRandomString(16)
  res.cookie(stateKey, state)

  // your application requests authorization
  const scope = 'user-read-private user-read-email user-top-read user-read-recently-played'
  res.end('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id,
      scope,
      redirect_uri,
      state
    })
  )
})

router.get('/callback', function(req, res) {
  const code = req.query.code || null
  const state = req.query.state || null
  const storedState = req.cookies ? req.cookies[stateKey] : null

  if (state === null || state !== storedState) {
    res.redirect('/#' +
      querystring.stringify({
        error: 'state_mismatch'
      }))
  } else {
    res.clearCookie(stateKey)
    const authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code,
        redirect_uri,
        grant_type: 'authorization_code'
      },
      headers: {
        Authorization: 'Basic ' + Buffer.from(client_id + ':' + client_secret).toString('base64')
      },
      json: true
    }

    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {
        accessToken = body.access_token
        refreshToken = body.refresh_token

        res.cookie('spotify_access_token', accessToken)

        // const meOptions = {
        //   url: `${baseUrl}/me`,
        //   headers: {
        //     Authorization: { Authorization: 'Bearer ' + accessToken },
        //   },
        //   json: true
        // }
        // request.get(meOptions, function(error, response, body) {
        //   if (!error && response.statusCode === 200) {

        //   }
        // })
        res.redirect('/')
      } else {
        res.redirect('/#' +
          querystring.stringify({
            error: 'invalid_token'
          }))
      }
    })
  }
})

router.get('/refresh_token', function (req, res) {
  // requesting access token from refresh token
  refreshToken = req.query.refresh_token
  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: { Authorization: 'Basic ' + Buffer.from(client_id + ':' + client_secret).toString('base64') },
    form: {
      grant_type: 'refreshToken',
      refreshToken
    },
    json: true
  }

  request.post(authOptions, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      accessToken = body.access_token
      res.send({
        accessToken
      })
    }
  })
})

router.get('/spotify/*', async function (req, res) {
  try {
    const accessToken = req.cookies ? req.cookies.spotify_access_token : null
    if (!accessToken) {
      console.log('User not authenticated to Spotify')
      res.status(401)
    }

    let path = req.params[0]
    const query = querystring.stringify(req.query)
    path += `?${query}`
    if (!path) {
      res.status(400).message('Path is required')
    }

    const getResponse = await get(path, accessToken)
    res.status(200).json(getResponse)
  } catch (e) {
    console.error('Error occurred querying Spotify', e)
    res.status(500).json(response(500, 'Internal server error'))
  }
})

async function get (path, accessToken) {
  if (!accessToken || accessToken === '') {
    throw new Error('User is not authenticated with Spotify')
  }

  const getResponse = await axios.get(`${baseUrl}/${path}`, {
    headers: { Authorization: 'Bearer ' + accessToken }
  })
  return getResponse.data
}

function response (code, message) {
  return {
    statusCode: code,
    message
  }
}

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
function generateRandomString (length) {
  let text = ''
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return text
}

module.exports = router
