import axios from 'axios'
import { performance } from 'perf_hooks'

const api = axios.create()

jest.setTimeout(1000 * 50)

/*
 * This many try/catch in code is because i return status 400
 * when lack some param or header, or when no satisfy the rules from API :|
 * */

const timer = {
  start: performance.now,
  end: performance.now
}

const url = catchURL()

let timeoutNonCached = 0

type Request = {
  endpoint_reference: string
  type: string
}

type Point = {
  amount: number
  url: string
  request: Request
}

const points: Point[] = []

const fakes = {
  game_id: 10,
  userHash: 'fc1bf6c0792ed24ad12e528cef5846f1'
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

function getURLFlag() {
  return process.argv.filter(arg => arg.match(/--url/))[0]
}

function catchURL() {
  const urlFlag = getURLFlag()

  if (!urlFlag) {
    console.log('required', '--url:https://myapp.com')
  }

  const [, ...url] = urlFlag.split(':')

  return url.join(':')
}

describe(`Testing on ${url}`, () => {
  afterAll(() => {
    informEndpoints(points)
    informTotalPoints(points)
  })

  it('endpoint should be able return status 400 if not inform query param GET "/?title="', async () => {
    const endpoint_reference = '/'
    const endpoint = `${url}${endpoint_reference}`

    try {
      await api.get(endpoint)
    } catch (e) {
      expect(e.response.status).toBe(400)

      points.push({
        amount: 10,
        url,
        request: {
          endpoint_reference,
          type: 'GET'
        }
      })
    }
  })

  it('endpoint shoule be return games from steam GET "/?title="', async () => {
    const endpoint_reference = '/?title=race'
    const endpoint = `${url}${endpoint_reference}`

    const start = performance.now()
    const { data, status } = await api.get(endpoint)

    expect(status).toBe(200)
    expect(data[0]).toHaveProperty('appid')
    expect(data[0]).toHaveProperty('name')
    expect(data.length).toBeGreaterThanOrEqual(20)

    const end = performance.now()
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

  it('endpoint GET "/:id"', async () => {
    const appid = 10
    const endpoint_reference = `/${appid}`

    const { data, status } = await api.get(`${url}${endpoint_reference}`)

    expect(status).toBe(200)
    expect(data).toHaveProperty('name')
    expect(data).toHaveProperty('type')
    expect(data).toHaveProperty('steam_appid')
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

  it('endpoint should be able return 400 or 403 if not send user_hash a game POST "/favorites"', async () => {
    const endpoint_reference = '/favorites'
    const endpoint = `${url}${endpoint_reference}`

    const body = {
      rating: 5,
      game_id: 10
    }

    try {
      const { status } = await api.post(endpoint, body)

      const errors = [400, 403]
      const expected = errors.includes(status)
      expect(expected).toBeTruthy

      points.push({
        amount: 10,
        url,
        request: {
          endpoint_reference,
          type: 'POST'
        }
      })
    } catch (e) {
      if (e.response.data.hasOwnProperty('message')) throw e

      points.push({
        amount: 10,
        url,
        request: {
          endpoint_reference,
          type: 'POST'
        }
      })
    }
  })

  it('endpoint should be able favorite a game POST "/favorites"', async () => {
    const endpoint_reference = '/favorites'
    const endpoint = `${url}${endpoint_reference}`

    const body = {
      rating: 5,
      game_id: fakes.game_id
    }

    try {
      const { data, status } = await api.post(endpoint, body, {
        headers: {
          'user-hash': 'app-master'
        }
      })

      const expected = [200, 201].includes(status)

      expect(expected).toBeTruthy()
      expect(data).toHaveProperty('user_hash')

      points.push({
        amount: 10,
        url,
        request: {
          endpoint_reference,
          type: 'POST'
        }
      })
    } catch (e) {
      const { data, status } = await api.post(endpoint, {
        ...body,
        login: 'app-master'
      })

      const expected = [200, 201].includes(status)

      expect(expected).toBeTruthy()
      expect(data).toHaveProperty('user_hash')

      points.push({
        amount: 10,
        url,
        request: {
          endpoint_reference,
          type: 'POST'
        }
      })
    }
  })

  it('endpoint list games favorited with user-hash GET "/favorites"', async () => {
    const endpoint_reference = '/favorites'
    const endpoint = `${url}${endpoint_reference}`

    const userHash = 'fc1bf6c0792ed24ad12e528cef5846f1'

    const { data, status } = await api.get(endpoint, {
      headers: {
        'user-hash': userHash
      }
    })

    const expected = [200, 204].includes(status)
    expect(expected).toBeTruthy()
    expect(data.length).toBeGreaterThanOrEqual(1)

    // check if you were sending property with name "appdetails", "gamedetails" or...
    for (const key in data[0]) {
      if (typeof data[0][key] == 'object') {
        expect(data[0][key]).toHaveProperty('steam_appid')
      }
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

  it('endpoint should be able return 200, 204 or empty array GET "/favorites"', async () => {
    const endpoint_reference = '/favorites'
    const endpoint = `${url}${endpoint_reference}`

    const { data, status } = await api.get(endpoint)
    const allowStatus = [200, 204].includes(status)

    if (allowStatus) {
      expect(allowStatus).toBeTruthy()
    }

    console.log(data.length)
    expect(data.length).toBeGreaterThanOrEqual(0)

    points.push({
      amount: 10,
      url,
      request: {
        endpoint_reference,
        type: 'GET'
      }
    })
  })

  it('endpoint should be able return 200 or array with elements GET "/favorites"', async () => {
    const endpoint_reference = '/favorites'
    const endpoint = `${url}${endpoint_reference}`

    const { data, status } = await api.get(endpoint, {
      headers: {
        'user-hash': fakes.userHash
      }
    })

    expect(status).toBe(200)

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

    points.push({
      amount: 10,
      url,
      request: {
        endpoint_reference,
        type: 'GET'
      }
    })
  })

  it('endpoint should be able to check if time response is than less 40% of before request (cache time) GET "/?title="', async () => {
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

  it('endpoint should be able to delete a game DELETE "/favorites"', async () => {
    const endpoint_reference = `/${fakes.game_id}`
    const endpoint = `${url}${endpoint_reference}`

    const { status } = await api.delete(endpoint, {
      headers: {
        'user-hash': fakes.userHash
      }
    })

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
})
