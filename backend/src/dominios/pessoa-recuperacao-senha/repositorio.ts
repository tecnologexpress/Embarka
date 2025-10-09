import crypto from "crypto";
import { PessoaRecuperacaoSenha } from "./entidade/pessoa-recuperacao-senha";
import { APP_DATA_SOURCE } from "@/infraestrutura/database";
import { IsNull } from "typeorm";

const PEPPER = process.env.RESET_TOKEN_PEPPER || "pepper-dev";

export class RecuperacaoDeSenhaRepositorio {
    constructor(
        private readonly repositorioPessoaRecuperacaoSenha = APP_DATA_SOURCE.getRepository(PessoaRecuperacaoSenha),
    ) { }

    /** Gera token aleatório seguro (64 hex = 32 bytes) */
    private gerarToken(): string {
        return crypto.randomBytes(32).toString("hex");
    }

    /** Hash do token com pepper (evita que quem ler DB use o token) */
    static hashToken(prm_token: string): string {
        return crypto.createHmac("sha256", PEPPER).update(prm_token).digest("hex");
    }

    async criarTokenReset(
        prm_id_pessoa: number,
        prm_ip: string,
        prm_ttl_min = Number(process.env.RESET_TOKEN_TTL_MIN || 30)
    ) {
        const TOKEN = this.gerarToken();
        const DS_TOKEN_HASH = RecuperacaoDeSenhaRepositorio.hashToken(TOKEN);

        await this.repositorioPessoaRecuperacaoSenha.update(
            { id_pessoa: prm_id_pessoa, dh_usado_em: IsNull() },
            { dh_usado_em: new Date() } // marca como "usado" para impedir múltiplos ativos
        );

        const DH_EXPIRA_EM = new Date(Date.now() + prm_ttl_min * 60 * 1000);
        const REGISTRO = this.repositorioPessoaRecuperacaoSenha.create({
            id_pessoa: prm_id_pessoa,
            ds_token_hash: DS_TOKEN_HASH,
            dh_expira_em: DH_EXPIRA_EM,
            dh_usado_em: null,
            ds_ip_solicitante: prm_ip,
        });
        await this.repositorioPessoaRecuperacaoSenha.save(REGISTRO);

        return { token: TOKEN, expira_em: DH_EXPIRA_EM };
    }

    /** Valida token: existe, não expirou, não usado */
    async validarToken(prm_token: string) {
        const DS_TOKEN_HASH = RecuperacaoDeSenhaRepositorio.hashToken(prm_token);
        const AGORA = new Date();
        const REGISTRO = await this.repositorioPessoaRecuperacaoSenha.findOne({
            where: { ds_token_hash: DS_TOKEN_HASH },
        });

        if (!REGISTRO) return { ok: false as const, reason: "NOT_FOUND" };
        if (REGISTRO.dh_usado_em) return { ok: false as const, reason: "ALREADY_USED" };
        if (REGISTRO.dh_expira_em <= AGORA) return { ok: false as const, reason: "EXPIRED" };

        return { ok: true as const, registro: REGISTRO };
    }

    /** Marca como usado (single-use) */
    async consumirToken(prm_token: string) {
        const DS_TOKEN_HASH = RecuperacaoDeSenhaRepositorio.hashToken(prm_token);
        await this.repositorioPessoaRecuperacaoSenha.update({ ds_token_hash: DS_TOKEN_HASH }, { dh_usado_em: new Date() });
    }
}
