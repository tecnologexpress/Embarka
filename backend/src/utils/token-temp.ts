import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET_TEMP || "temp-secret";
const EXP = "10m";

export function gerarTokenTemp(prm_payload: { id_pessoa: number }) {
  return jwt.sign(prm_payload, SECRET, { expiresIn: EXP });
}

export function verificarTokenTemp(prm_token: string) {
  return jwt.verify(prm_token, SECRET) as { id_pessoa: number, iat: number, exp: number };
}
