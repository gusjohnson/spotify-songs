/* eslint-disable camelcase */
/* eslint-disable no-undef */

const querystring = require('querystring')
const { Router } = require('express')
const router = Router()
const request = require('request')
const axios = require('axios')

const client_id = '953922c863b1462da160a182af9f5330'
const client_secret = '762f8c9887ed4c0dba1e0f7d7639d3ad'
// var redirect_uri = 'http://localhost:8888/callback'
const redirect_uri = 'http://localhost:3000/api/callback'
const baseUrl = 'https://api.spotify.com/v1'

let accessToken, refreshToken

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
const generateRandomString = function (length) {
  let text = ''
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return text
}

const stateKey = 'spotify_auth_state'

router.get('/login', function (req, res) {
  const state = generateRandomString(16)
  res.cookie(stateKey, state)

  // your application requests authorization
  const scope = 'user-read-private user-read-email user-top-read user-read-recently-played'
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id,
      scope,
      redirect_uri,
      state
    }))
})

router.get('/callback', function (req, res) {
  // your application requests refresh and access tokens
  // after checking the state parameter

  const code = req.query.code || null
  const state = req.query.state || null
  const storedState = req.cookies ? req.cookies[stateKey] : null
  console.log(state)
  console.log(storedState)

  // if (state === null || state !== storedState) {
  if (state === null) {
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

    request.post(authOptions, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        accessToken = body.access_token
        refreshToken = body.refresh_token

        const options = {
          url: 'https://api.spotify.com/v1/me',
          headers: { Authorization: 'Bearer ' + accessToken },
          json: true
        }

        // use the access token to access the Spotify Web API
        request.get(options, function (error, response, body) {
          console.log(body)
        })

        // we can also pass the token to the browser to make requests from there
        res.redirect('/#' +
          querystring.stringify({
            accessToken,
            refreshToken
          }))
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
    let path = req.params[0]
    const query = querystring.stringify(req.query)
    path += `?${query}`
    if (!path) {
      res.status(400).message('Path is required')
    }

    const getResponse = await get(path)
    res.status(200).json(getResponse)
  } catch (e) {
    console.error('Error occurred querying Spotify', e)
    res.status(500).json(response(500, 'Internal server error'))
  }
})

async function get (path) {
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

module.exports = router
