const axios = require('axios')
const crypto = require('crypto')
const { Nota } = require('./Notas.js')
const Counter = new Nota()

const userHash = crypto.randomBytes(20).toString('hex')
const appid = '704000'

const axiosOptions = {
    headers: {
        'user-hash': userHash,
    },
    timeout: 10 * 1000,
}

exports.favoriteTest = (baseUrl) =>
    describe('Testing favorite', () => {
        const favoriteUrl = `${baseUrl}/favorite`
        test('POST endpoint: /favorite without user-hash', async () => {
            console.log('POST endpoint: /favorite without user-hash');
            const { status } = await axios.post(favoriteUrl)
            expect(status === 400 || status === 403).toBe(true)
            Counter.incrementar(10)
        })

        test('GET endpoint: /favorite with user-hash before valid POST', async () => {
            console.log('GET endpoint: /favorite with user-hash before valid POST');
            const { data, status } = await axios.get(favoriteUrl, axiosOptions)
            expect(data).toStrictEqual([])
            expect(status === 200 || status === 204).toBe(true)
            Counter.incrementar(10)
        })

        test('POST endpoint: /favorite with user-hash', async () => {
            console.log('POST endpoint: /favorite with user-hash');
            const appidOnUrl = `${favoriteUrl}/${appid}`
            const response1 = await axios.post(
                appidOnUrl,
                { rating: 3 },
                axiosOptions,
            )
            if (response1.status != 200) {
                const response2 = await axios.post(
                    favoriteUrl,
                    {
                        appid: appid,
                        rating: 3,
                    },
                    axiosOptions,
                )
                expect(response2.status).toBe(200)
            } else {
                expect(response1.status).toBe(200)
            }
            Counter.incrementar(10)
        })

        test('GET endpoint: /favorite without user-hash after', async () => {
            console.log('GET endpoint: /favorite without user-hash after');
            const { data, status } = await axios.get(favoriteUrl)
            if (status === 200 || status === 203) {
                expect(data).toBe([])
            } else {
                expect(status === 400 || status === 403).toBe(true)
            }
            Counter.incrementar(10)
        })

        test('GET endpoint: /favorite with user-hash after valid POST', async () => {
            console.log('GET endpoint: /favorite with user-hash after valid POST');
            const { data, status } = await axios.get(favoriteUrl, axiosOptions)
            expect(status).toBe(200)
            expect(data.length).toBe(1)
            expect(data[0]).toHaveProperty('appid')
            expect(data[0].appid == appid).toBe(true)
            if (!data[0].hasOwnProperty('type')) {
                let gameDesc
                for (let item in data[0]) {
                    if (data[0][item].hasOwnProperty('type')) {
                        gameDesc = data[0][item]
                    }
                }
                expect(gameDesc).toHaveProperty('type')
                expect(gameDesc).toHaveProperty('detailed_description')
            }
            Counter.incrementar(10)
        })

        test('DELETE endpoint: /favorite/:appid', async () => {
            console.log('DELETE endpoint: /favorite/:appid');
            const { status } = await axios.delete(
                `${favoriteUrl}/${appid}`,
                axiosOptions,
            )
            expect(status === 200 || status === 202 || status === 203).toBe(
                true,
            )
            Counter.incrementar(10)
        })
    })

exports.NotaFavorito = Counter
