import { HttpErro } from "./http-error"

export class JaExisteErro extends HttpErro {
    constructor(prm_message = "Recurso já existe") {
        super(409, prm_message)
    }
}