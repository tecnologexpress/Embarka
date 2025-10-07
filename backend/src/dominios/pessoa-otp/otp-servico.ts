import { APP_DATA_SOURCE } from "@/infraestrutura/database";
import { PessoaOtp } from "./entidade/pessoa-otp.entidade";
import bcrypt from "bcrypt";
import { enviarEmail } from "@/infraestrutura/email";

const OTP_TTL_MIN = 10;          // minutos de validade
const OTP_DIGITOS = 6;
const MAX_TENTATIVAS = 5;

function gerarCodigo(): string {
  // 6 dígitos (000000–999999)
  return Math.floor(100000 + Math.random() * 900000).toString().padStart(OTP_DIGITOS, "0");
}

export async function criarEnviarOtp(prm_id_pessoa: number, prm_email: string) {
  const CODIGO = gerarCodigo();
  const CODIGO_HASH = await bcrypt.hash(CODIGO, 10);

  const EXPIRA = new Date();
  EXPIRA.setMinutes(EXPIRA.getMinutes() + OTP_TTL_MIN);

  const REPOSITORIO = APP_DATA_SOURCE.getRepository(PessoaOtp);
  const OTP = REPOSITORIO.create({
    id_pessoa: prm_id_pessoa,
    ds_codigo_hash: CODIGO_HASH,
    dh_expira_em: EXPIRA,
  });
  await REPOSITORIO.save(OTP);

  // e-mail (HTML simples; personalize)
  await enviarEmail({
    prm_para: prm_email,
    prm_assunto: "Seu código de verificação",
    prm_html: `
      <div style="font-family:Arial, sans-serif">
        <h2>Seu código de verificação</h2>
        <p>Use o código abaixo para concluir seu login:</p>
        <div style="font-size:28px;font-weight:bold;letter-spacing:6px;margin:16px 0">${CODIGO}</div>
        <p>Ele expira em ${OTP_TTL_MIN} minutos.</p>
      </div>
    `,
    prm_texto: `Seu código é: ${CODIGO} (expira em ${OTP_TTL_MIN} minutos)`,
  });

  // por segurança não retornamos o código
  return { expira_em: EXPIRA };
}

export async function verificarOtp(prm_id_pessoa: number, prm_codigo: string) {
  const REPOSITORIO = APP_DATA_SOURCE.getRepository(PessoaOtp);

  // pega o OTP mais recente não usado
  const OTP = await REPOSITORIO.findOne({
    where: { id_pessoa: prm_id_pessoa, bl_usado: false },
    order: { dh_criado_em: "DESC" },
  });

  if (!OTP) return { ok: false, reason: "NAO_ENCONTRADO" };

  const AGORA = new Date();
  if (OTP.dh_expira_em < AGORA) return { ok: false, reason: "EXPIRADO" };

  if (OTP.nr_tentativas >= MAX_TENTATIVAS) return { ok: false, reason: "MUITAS_TENTATIVAS" };

  const CONFERE = await bcrypt.compare(prm_codigo, OTP.ds_codigo_hash);
  if (!CONFERE) {
    OTP.nr_tentativas += 1;
    await REPOSITORIO.save(OTP);
    return { ok: false, reason: "CODIGO_INVALIDO", tentativas: OTP.nr_tentativas };
  }

  // marca como usado
  OTP.bl_usado = true;
  await REPOSITORIO.save(OTP);

  return { ok: true };
}
