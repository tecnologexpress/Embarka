import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const SEED = process.env.HASH_SEED || '';

// Função para gerar um hash da senha
// Recebe a senha como parâmetro, adiciona um seed para aumentar a segurança
// Retorna o hash da senha
// O hash é gerado usando bcrypt com um salt de 10 rounds
// A senha é concatenada com o seed para aumentar a segurança
// O seed é carregado do arquivo .env, se não estiver definido, usa uma string
// padrão vazia
export async function criarSenhaHash(prm_senha: string): Promise<string> {
    const SALTED = prm_senha + SEED;
    const SALT = await bcrypt.genSalt(10);
    return bcrypt.hash(SALTED, SALT);
}

// Função para validar a senha
// Recebe a senha informada pelo usuário e compara com a senha com hash
export async function validarSenhaHash(
    prm_senha: string,
    prm_senha_hash: string
): Promise<boolean> {
    const SALTED = prm_senha + SEED;
    return bcrypt.compare(SALTED, prm_senha_hash);
}