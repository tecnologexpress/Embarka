import type { IPessoaDTO } from "../../dto/pessoa";

interface Props {
    doc: string;
}

const buscarPessoaPorDocumento = ({doc}: Props): Promise<IPessoaDTO | null> => {
    console.log(`${doc}`);
    // Implementação fictícia para ilustrar
    return Promise.resolve(null);

}

export default buscarPessoaPorDocumento;