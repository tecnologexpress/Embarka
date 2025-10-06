import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { HandlerDeErros } from './middleware/erro-handler';
import { CONFIGURAR_ROTAS } from './infraestrutura/rotas';

// Carrega variáveis de ambiente
dotenv.config();

const APP = express();

// Variáveis de ambiente
const NODE_ENV = process.env.NODE_ENV || 'development';
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';
const RATE_LIMIT_WINDOW_MS = Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000; // 15 minutos
const RATE_LIMIT_MAX_REQUESTS = Number(process.env.RATE_LIMIT_MAX_REQUESTS) || 100;

// Middleware de segurança
APP.use(helmet());

// Rate limiting
const LIMITADOR_DE_TAXA = rateLimit({
    windowMs: RATE_LIMIT_WINDOW_MS,
    max: RATE_LIMIT_MAX_REQUESTS,
    message: 'Muitas requisições deste IP, tente novamente mais tarde.'
});
APP.use(LIMITADOR_DE_TAXA);

// Configuração CORS
const ENDERECOS_PERMITIDOS = [CORS_ORIGIN];
APP.use(cors({
    origin: ENDERECOS_PERMITIDOS,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

// Middleware de parsing
APP.use(express.json({ limit: '10mb' }));
APP.use(express.urlencoded({ extended: true, limit: '10mb' }));
APP.use(cookieParser());

// Middleware de compressão
APP.use(compression());

// Middleware de logging
APP.use(morgan('combined'));

// Configuração automática de todas as rotas
CONFIGURAR_ROTAS(APP);

// Middleware de erro (último)
APP.use(HandlerDeErros);

export default APP;