const { rootTest, NotaRoot } = require('./root.test.js')
const { favoriteTest, NotaFavorito } = require('./favorite.test.js')

const argUrl = process.argv[3].slice(2)

if (argUrl.slice(0, 3) != 'url') {
    console.log('Correct arg --> "--url=http://myUrl.com"')
    process.exit()
}
const baseUrl = argUrl.slice(4)

describe('Testing in row', () => {
    rootTest(baseUrl)
    favoriteTest(baseUrl)
})

afterAll(() => {
    console.log(
        'Nota final:' + (NotaRoot.consultar() + NotaFavorito.consultar()),
    )
})
