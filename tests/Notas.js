exports.Nota = class {
    constructor() {
        this.nota = 0
    }
    incrementar(nota) {
        this.nota = this.nota + nota
    }
    consultar() {
        return this.nota
    }
}
