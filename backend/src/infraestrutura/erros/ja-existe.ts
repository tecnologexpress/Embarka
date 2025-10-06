import { HttpErro } from "./http-error"

export class JaExisteErro extends HttpErro {
    constructor(message = "Recurso já existe") {
        super(409, message)
    }
}