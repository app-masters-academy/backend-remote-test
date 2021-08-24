const axios = require('axios')

//Jest config
jest.setTimeout(20000)

//Axios interceptors
axios.interceptors.request.use(
    (config) => {
        config.metadata = { startTime: new Date() }
        return config
    },
    (error) => {
        return Promise.reject(error)
    },
)

axios.interceptors.response.use(
    (response) => {
        response.config.metadata.endTime = new Date()
        response.duration =
            response.config.metadata.endTime -
            response.config.metadata.startTime
        return response
    },
    (error) => {
        return Promise.reject(error)
    },
)

//const baseUrl = process.argv['url']
const baseUrl = 'https://favorite-steam-api.herokuapp.com'

console.log(`Url sendo testada: ${baseUrl}`)

let responseTime = []
let games = []

test('GET endpoint: /', async () => {
    const { data, status, duration } = await axios.get(baseUrl)
    expect(status).toBe(200)
    expect(data.length).toBeGreaterThan(20)
    expect(data[0]).toHaveProperty('appid')
    expect(data[0]).toHaveProperty('name')
    games = data.slice(10)
    responseTime.push(duration)
})

test('GET endpoint: /nao-exista', async () => {
    try {
        const response = await axios.get(`${baseUrl}/nao-exista`)
        throw response
    } catch (err) {
        expect(err.response.status).toBe(404)
    }
})

test('GET endpoint: /:id', async () => {
    const sucessRequest = await Promise.all(
        games.map(async (elem) => {
            try {
                const { data } = await axios.get(`${baseUrl}/${elem.appid}`)
                if (data[elem.appid]) {
                    return data[elem.appid].data
                } else {
                    return data
                }
            } catch (err) {}
        }),
    )
    expect(sucessRequest[0]).toHaveProperty('name')
    expect(sucessRequest[0]).toHaveProperty('type')
    expect(sucessRequest[0]).toHaveProperty('detailed_description')
})

test('GET endpoint: / cache verify', async () => {
    const { duration } = await axios.get(baseUrl)
    responseTime.push(duration)
    expect(responseTime[1] < 1000).toBe(true)
})
