import { Router } from 'express';
import { AuthControlador } from '../controlador';
import { AuthServico } from '../servico';
import { PessoaRepositorio } from '@/dominios/pessoa/repositorio';
import { autenticarToken } from '@/middleware/autenticar-token';

const AUTH_ROTA = Router();

const PESSOA_REPOSITORIO = new PessoaRepositorio();
const AUTH_SERVICO = new AuthServico(PESSOA_REPOSITORIO);
const AUTH_CONTROLADOR = new AuthControlador(AUTH_SERVICO, PESSOA_REPOSITORIO);

// etapa 1: credenciais → cria temp2fa + envia e-mail
AUTH_ROTA.post("/login", (req, res) => AUTH_CONTROLADOR.autenticarUsuario(req, res));

// etapa 2: verifica código → emite token final
AUTH_ROTA.post("/verificar-codigo", (req, res) => AUTH_CONTROLADOR.verificar2FA(req, res));

// reenvio do código
AUTH_ROTA.post("/reenviar-codigo", (req, res) => AUTH_CONTROLADOR.reenviar2FA(req, res));

// info do usuário autenticado (precisa token final)
AUTH_ROTA.get("/me", autenticarToken, (req, res) => AUTH_CONTROLADOR.me(req, res));

export default AUTH_ROTA;