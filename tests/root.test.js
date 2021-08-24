const axios = require('axios')
const { Nota } = require('./Notas.js')
const Counter = new Nota()
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
        return error.response
    },
)

let responseTime = []
let games = []

exports.rootTest = (baseUrl) =>
    describe('Testing root', () => {
        test('GET endpoint: /', async () => {
            const { data, status, duration } = await axios.get(baseUrl)
            expect(status).toBe(200)
            expect(data.length).toBeGreaterThan(20)
            expect(data[0]).toHaveProperty('appid')
            expect(data[0]).toHaveProperty('name')
            games = data.slice(10)
            responseTime.push(duration)
            Counter.incrementar(10)
        })

        test('GET endpoint: /nao-exista', async () => {
            const { status } = await axios.get(`${baseUrl}/nao-exista`)
            expect(status).toBe(404)
            Counter.incrementar(10)
        })

        test('GET endpoint: /:id', async () => {
            const sucessRequest = await Promise.all(
                games.map(async (elem) => {
                    const { data, status } = await axios.get(
                        `${baseUrl}/${elem.appid}`,
                    )
                    if (data.steam_appid) {
                        return data
                    }
                    if (data[elem.appid]) {
                        return data[elem.appid].data
                    }
                }),
            )
            expect(sucessRequest[0]).toHaveProperty('name')
            expect(sucessRequest[0]).toHaveProperty('type')
            expect(sucessRequest[0]).toHaveProperty('detailed_description')
            Counter.incrementar(10)
        })

        test('GET endpoint: / cache verify', async () => {
            const { duration } = await axios.get(baseUrl)
            responseTime.push(duration)
            expect(responseTime[1] < 1000).toBe(true)
            Counter.incrementar(20)
        })
    })

exports.NotaRoot = Counter