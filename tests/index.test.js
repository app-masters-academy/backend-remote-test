const { rootTest, NotaRoot } = require('./root.test.js')
const { favoriteTest, NotaFavorito } = require('./favorite.test.js')

const argUrl = process.argv[process.argv.length - 1].slice(2)

if (argUrl.slice(0, 3) != 'url') {
    console.log('Correct arg --> "--url=http://myUrl.com"')
    process.exit()
}
const baseUrl = argUrl.slice(4)
console.log(`Testing: ${baseUrl}`)

describe('Testing in row', () => {
    rootTest(baseUrl)
    favoriteTest(baseUrl)
})

afterAll(() => {
    console.log(
        'Nota final:' + (NotaRoot.consultar() + NotaFavorito.consultar()),
    )
})
