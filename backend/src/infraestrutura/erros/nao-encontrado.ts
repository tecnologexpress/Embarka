import { HttpErro } from "./http-error"

export class NaoEncontradoErro extends HttpErro{
    constructor(message = "Recurso não encontrado"){
        super(404, message)
    }
}