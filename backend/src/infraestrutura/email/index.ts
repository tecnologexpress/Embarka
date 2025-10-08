import nodemailer from "nodemailer";

const HOST = process.env.SMTP_HOST!;
const PORT = Number(process.env.SMTP_PORT || 465);
const SECURE = String(process.env.SMTP_SECURE || "true") === "true"; // 465 => true
const USER = process.env.SMTP_USER!;
const PASS = process.env.SMTP_PASS!;
const FROM = process.env.SMTP_FROM || `Embarka <no-reply@embarka.local>`;
const TIMEOUT = Number(process.env.SMTP_TIMEOUT_MS || 10000);

export const TRANSPORTER = nodemailer.createTransport({
    host: HOST,
    port: PORT,
    secure: SECURE, // 465 = SSL
    auth: { user: USER, pass: PASS },
    // se o servidor usa certificado interno/self-signed:
    tls: { rejectUnauthorized: false },
    connectionTimeout: TIMEOUT,
    greetingTimeout: TIMEOUT,
    socketTimeout: TIMEOUT,
});

export async function verificarSMTP() {
    try {
        await TRANSPORTER.verify();
        return { ok: true };
    } catch (e: any) {
        const CODE = e?.code || "";
        let msg = e?.message || "Falha ao verificar SMTP";
        if (/ENOTFOUND/i.test(msg) || CODE === "ENOTFOUND") {
            msg = "Falha de DNS ao resolver o servidor SMTP. Verifique SMTP_HOST (pode ser interno/VPN).";
        } else if (/ETIMEDOUT/i.test(msg) || CODE === "ETIMEDOUT") {
            msg = "Tempo esgotado ao conectar no SMTP (porta 465). Verifique firewall/VPN.";
        } else if (/ECONNREFUSED/i.test(msg) || CODE === "ECONNREFUSED") {
            msg = "Conexão recusada pelo SMTP. Verifique host/porta.";
        }
        throw new Error(msg);
    }
}

type Envio = {
    prm_para: string | string[];
    prm_assunto: string;
    prm_texto?: string;
    prm_html?: string;
};

export async function enviarEmail({ prm_para, prm_assunto, prm_texto, prm_html }: Envio) {
    // garante string
    const PARA = Array.isArray(prm_para) ? prm_para.join(", ") : prm_para;
    return TRANSPORTER.sendMail({
        from: FROM,
        to: PARA,
        subject: prm_assunto,
        text: prm_texto,
        html: prm_html,
    });
}
