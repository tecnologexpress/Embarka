import { HttpErro } from "./http-error"

export class NaoEncontradoErro extends HttpErro{
    constructor(prm_message = "Recurso não encontrado"){
        super(404, prm_message)
    }
}