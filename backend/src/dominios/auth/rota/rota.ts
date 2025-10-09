import { Router } from 'express';
import { AuthControlador } from '../controlador';
import { AuthServico } from '../servico';
import { PessoaRepositorio } from '@/dominios/pessoa/repositorio';
import { autenticarToken } from '@/middleware/autenticar-token';
import { RecuperacaoDeSenhaServico } from '@/dominios/pessoa-recuperacao-senha/servico';
import { RecuperacaoDeSenhaRepositorio } from '@/dominios/pessoa-recuperacao-senha/repositorio';
import { RecuperacaoDeSenhaControlador } from '@/dominios/pessoa-recuperacao-senha/controlador';
import { LIMITAR_SOLICITACAO_RECUPERACAO } from '@/dominios/pessoa-recuperacao-senha/utils/limitar-solicitacao-recuperacao';

const AUTH_ROTA = Router();

const PESSOA_REPOSITORIO = new PessoaRepositorio();
const AUTH_SERVICO = new AuthServico(PESSOA_REPOSITORIO);
const AUTH_CONTROLADOR = new AuthControlador(AUTH_SERVICO, PESSOA_REPOSITORIO);

const RECUPERACAO_DE_SENHA_REPOSITORIO = new RecuperacaoDeSenhaRepositorio();
const RECUPERACAO_DE_SENHA_SERVICO = new RecuperacaoDeSenhaServico(PESSOA_REPOSITORIO, RECUPERACAO_DE_SENHA_REPOSITORIO);
const RECUPERACAO_DE_SENHA_CONTROLADOR = new RecuperacaoDeSenhaControlador(RECUPERACAO_DE_SENHA_SERVICO);

// etapa 1: credenciais → cria temp2fa + envia e-mail
AUTH_ROTA.post("/login", (req, res) => AUTH_CONTROLADOR.autenticarUsuario(req, res));

// etapa 2: verifica código → emite token final
AUTH_ROTA.post("/verificar-codigo", (req, res) => AUTH_CONTROLADOR.verificar2FA(req, res));

// reenvio do código
AUTH_ROTA.post("/reenviar-codigo", (req, res) => AUTH_CONTROLADOR.reenviar2FA(req, res));

// logout (remove cookie 'token')
AUTH_ROTA.post("/logout", autenticarToken, (req, res) => AUTH_CONTROLADOR.logout(req, res));

// info do usuário autenticado (precisa token final)
AUTH_ROTA.get("/me", autenticarToken, (req, res) => AUTH_CONTROLADOR.me(req, res));

// solicitar link de recuperação (resposta sempre 204)
AUTH_ROTA.post("/recuperar/solicitar", LIMITAR_SOLICITACAO_RECUPERACAO, (req, res) => RECUPERACAO_DE_SENHA_CONTROLADOR.solicitar(req, res));

// confirmar troca de senha com token
AUTH_ROTA.post("/recuperar/confirmar", (req, res) => RECUPERACAO_DE_SENHA_CONTROLADOR.confirmar(req, res));

export default AUTH_ROTA;