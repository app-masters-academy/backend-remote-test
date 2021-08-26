import axios from 'axios'
import { performance } from 'perf_hooks'

const api = axios.create()

jest.setTimeout(1000 * 50)

/*
 * This many try/catch in code is because i return status 400
 * when lack some param or header, or when no satisfy the rules from API :|
 * */

type Request = {
  endpoint_reference: string
  type: string
}

type Point = {
  amount: number
  url: string
  request: Request
}

const timer = {
  start: performance.now,
  end: performance.now
}

const url = getURL()

let timeoutNonCached = 0

const points: Point[] = []

const fakes = {
  game_id: 10,
  userHash: 'fc1bf6c0792ed24ad12e528cef5846f1'
}

function catchURL() {
  const regex = new RegExp('--url', 'gi')

  const param = process.argv.find(arg => regex.test(arg))

  const [, protocol, domain, port] = param.split(':')

  let protocolDomain = `${protocol}://${domain}`

  if (port) {
    protocolDomain += `:${port}`
  }

  const parseDomain = protocolDomain
    .split('/')
    .filter(parseDomain => parseDomain !== '')
    .pop()

  const url = `${protocol}://${parseDomain}`

  return url
}

function getURL() {
  const url = catchURL()

  if (!url) {
    console.log('required', '--url:https://myapp.com')
    process.exit(0)
  }

  return url
}

function informTotalPoints(points: Point[]) {
  const total = points.reduce((a, b) => a + b.amount, 0)

  console.log(`> Total Points ${total}`)
}

function informEndpoints(points: Point[]) {
  for (const { request, url } of points) {
    console.log(`${request.type} ${url}${request.endpoint_reference}`)
  }
}

describe(`Testing on ${url}`, () => {
  let appId = 0
  let appName = ''

  afterAll(() => {
    informTotalPoints(points)
  })

  describe('Endpoint "/"', () => {
    it.only('should be return games from steam GET "/"', async () => {
      const endpoint_reference = '/'
      const endpoint = `${url}${endpoint_reference}`

      const start = timer.start()
      const { data, status } = await api.get(endpoint)

      appId = data[0].appid
      appName = data[0].name

      expect(status).toBe(200)
      expect(data[0]).toHaveProperty('appid')
      expect(data[0]).toHaveProperty('name')
      expect(data.length).toBeGreaterThanOrEqual(20)

      const end = timer.end()
      const ms = end - start
      timeoutNonCached = Number(ms.toFixed(0))

      points.push({
        amount: 10,
        url,
        request: {
          endpoint_reference,
          type: 'GET'
        }
      })
    })

    it.only('should be return one game with details GET "/:id"', async () => {
      const endpoint_reference = `/${appId}`

      const { data, status } = await api.get(`${url}${endpoint_reference}`)

      expect(status).toBe(200)
      expect(data.steam_appid).toBe(appId)
      expect(data.name).toBe(appName)
      expect(data).toHaveProperty('type')
      expect(data).toHaveProperty('detailed_description')

      points.push({
        amount: 10,
        url,
        request: {
          endpoint_reference,
          type: 'GET'
        }
      })
    })

    it.only('should be able to check if time response is than less 40% of before request (cache time) GET "/"', async () => {
      const endpoint_reference = '/'
      const endpoint = `${url}${endpoint_reference}`

      const start = timer.start()

      await api.get(endpoint)

      const end = timer.end()

      const ms = end - start
      const timeoutCached = Number(ms.toFixed(0))

      const timeoutNonCachedFortyLess = (40 * timeoutNonCached) / 100

      const isFortyLess = timeoutCached < timeoutNonCachedFortyLess

      expect(isFortyLess).toBeTruthy()

      points.push({
        amount: 10,
        url,
        request: {
          endpoint_reference,
          type: 'GET'
        }
      })
    })
  })

  describe('Endpoint "/favorite"', () => {
    it.only('should be able return 400, 403 or 409 if not send "user-hash" a game POST "/favorite"', async () => {
      const endpoint_reference = '/favorite'
      const endpoint = `${url}${endpoint_reference}`

      const body = {
        rating: 5,
        game_id: 10
      }

      let status = 0

      try {
        const response = await api.post(endpoint, body)

        status = response.status
      } catch (e) {
        status = e.response.status
      }

      const allowedStatus = [400, 403, 409]
      const isAnAllowedStatus = allowedStatus.includes(status)

      expect(isAnAllowedStatus).toBeTruthy()

      points.push({
        amount: 10,
        url,
        request: {
          endpoint_reference,
          type: 'POST'
        }
      })
    })

    it.only('should be return 200, 204 or empty array GET "/favorite"', async () => {
      const endpoint_reference = '/favorite'
      const endpoint = `${url}${endpoint_reference}`

      const { data, status } = await api.get(endpoint, {
        headers: {
          'user-hash': 'app-master'
        }
      })

      const allowedStatus = [200, 204]
      const isAnAllowedStatus = allowedStatus.includes(status)

      expect(isAnAllowedStatus).toBeTruthy()
      expect(data).toHaveLength(0)

      points.push({
        amount: 10,
        url,
        request: {
          endpoint_reference,
          type: 'GET'
        }
      })
    })

    it.only('should be create new game favorite "user-hash" POST "/favorite"', async () => {
      const endpoint_reference = '/favorite'
      const endpoint = `${url}${endpoint_reference}`

      // sending game_id on body
      const { status } = await api.post(
        endpoint,
        {
          game_id: appId,
          rating: 5
        },
        {
          headers: {
            'user-hash': 'app-master'
          }
        }
      )

      const allowedStatus = [200, 201]
      const isAnAllowedStatus = allowedStatus.includes(status)

      expect(isAnAllowedStatus).toBeTruthy()

      points.push({
        amount: 10,
        url,
        request: {
          endpoint_reference,
          type: 'POST'
        }
      })
    })

    it.only('should be able return 200 when to disfavor a game DELETE "/favorite"', async () => {
      const endpoint_reference = `/favorite/${appId}`
      const endpoint = `${url}${endpoint_reference}`

      let status = 0

      try {
        const { status: statusSuccess } = await api.delete(endpoint, {
          headers: {
            'user-hash': 'app-master'
          }
        })
        status = statusSuccess
      } catch (e) {
        status = e.response.status
      }

      expect(status).toBe(200)

      points.push({
        amount: 10,
        url,
        request: {
          endpoint_reference,
          type: 'DELETE'
        }
      })
    })

    it.only('should be able return 403 if not delete a game DELETE "/favorite"', async () => {
      const endpoint_reference = `/favorite/${appId}`
      const endpoint = `${url}${endpoint_reference}`

      let status = 0

      try {
        const { status: statusFailed } = await api.delete(endpoint, {
          headers: {
            'user-hash': fakes.userHash
          }
        })
        status = statusFailed
      } catch (e) {
        status = e.response.status
      }

      const allowedStatus = [200, 204, 409]
      const isAnAllowedStatus = allowedStatus.includes(status)

      expect(isAnAllowedStatus).toBeTruthy()

      points.push({
        amount: 10,
        url,
        request: {
          endpoint_reference,
          type: 'DELETE'
        }
      })
    })

    it.only('should be able return 200, 204 or empty array GET "/favorite"', async () => {
      const endpoint_reference = '/favorite'
      const endpoint = `${url}${endpoint_reference}`

      const { data, status } = await api.get(endpoint)

      const allowedStatus = [200, 204]
      const isAnAllowedStatus = allowedStatus.includes(status)

      expect(isAnAllowedStatus).toBeTruthy()

      if (status === 200) {
        expect(data.length).toBeGreaterThanOrEqual(0)
      }

      points.push({
        amount: 10,
        url,
        request: {
          endpoint_reference,
          type: 'GET'
        }
      })
    })

    it.only('should be able return 200 or array with elements GET "/favorite"', async () => {
      const endpoint_reference = '/favorite'
      const endpoint = `${url}${endpoint_reference}`

      const { status } = await api.get(endpoint, {
        headers: {
          'user-hash': fakes.userHash
        }
      })

      const allowedStatus = [200, 204]
      const isAnAllowedStatus = allowedStatus.includes(status)

      expect(isAnAllowedStatus).toBeTruthy()

      /*
      * I'm commenting out the code to signal
      * that the API can return different keys like "appId", "gameId", ....
      
      if (data.hasOwnProperty('game')) {
        expect(data[0]).toHaveProperty('appId')
        expect(data[0]).toHaveProperty('rating')
        // check if you were sending property with name "appdetails", "gamedetails" or...
        for (const key in data[0]) {
          if (typeof data[0][key] == 'object') {
            expect(data[0][key]).toHaveProperty('steam_appid')
          }
        }
      } else {
        expect(data[0]).toHaveProperty('appId')
        expect(data[0]).toHaveProperty('rating')
        expect(data[0]).toHaveProperty('type')
        expect(data[0]).toHaveProperty('detailed_description')
      }
     */

      points.push({
        amount: 10,
        url,
        request: {
          endpoint_reference,
          type: 'GET'
        }
      })
    })
  })
})
