const axios = require('axios')
const { Nota } = require('./Notas.js')
const Counter = new Nota()

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
                    const response = await axios.get(`${baseUrl}/${elem.appid}`)
                    if (response.data.steam_appid) {
                        return response
                    }
                    if (response.data[elem.appid]) {
                        response.data[elem.appid].status = response.status
                        return response.data[elem.appid]
                    }
                }),
            )
            expect(sucessRequest[0].status).toBe(200)
            expect(sucessRequest[0].data).toHaveProperty('name')
            expect(sucessRequest[0].data).toHaveProperty('type')
            expect(sucessRequest[0].data).toHaveProperty('detailed_description')
            Counter.incrementar(10)
        })

        test('GET endpoint: / cache verify', async () => {
            const { duration } = await axios.get(baseUrl)
            responseTime.push(duration)
            expect(
                responseTime[0] > responseTime[1] || responseTime[1] < 1000,
            ).toBe(true)
            Counter.incrementar(20)
        })
    })

exports.NotaRoot = Counter
