import jwt from 'jsonwebtoken';

export interface PayloadToken {
  id_pessoa: number;
  id_pessoa_acesso: number;
  email: string;
  usuario_ip: string;
  role: string;
}

export function gerarToken(prm_payload: PayloadToken): string {
  const JWT_SECRET = process.env.JWT_SECRET || ''; // Idealmente, defina no .env
  const EXPIRES_IN = '9h'; // ou '7d', '30m', etc.

  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET não está definido no ambiente');
  }

  return jwt.sign(prm_payload, JWT_SECRET, {
    expiresIn: EXPIRES_IN,
  });
}

export function verificarToken(prm_token: string): PayloadToken {
  const JWT_SECRET = process.env.JWT_SECRET;

  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET não está definido no ambiente');
  }

  try {
    const DECODIFICADO = jwt.verify(prm_token, JWT_SECRET) as PayloadToken;
    return DECODIFICADO;
  } catch (err) {
    console.error('Erro ao verificar token:', err);
    throw new Error('Token inválido ou expirado');
  }
}