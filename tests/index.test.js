const { rootTest, NotaRoot } = require('./root.test.js')
const { favoriteTest, NotaFavorito } = require('./favorite.test.js')

jest.setTimeout(45000)

const argUrl = process.argv[process.argv.length - 1].slice(2)

if (argUrl.slice(0, 3) != 'url') {
    console.log('Correct arg --> "--url=http://myUrl.com"')
    process.exit()
}
const baseUrl = argUrl.slice(4)

describe('Testing in row', () => {
    beforeAll(() => {
        console.log(`Testing: ${baseUrl}`)
    })
    rootTest(baseUrl)
    favoriteTest(baseUrl)
    afterAll(() => {
        console.log(`Testing: ${baseUrl}`)
        console.log(
            'Nota final:' + (NotaRoot.consultar() + NotaFavorito.consultar()),
        )
    });

})
