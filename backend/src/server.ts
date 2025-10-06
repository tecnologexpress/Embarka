import dotenv from 'dotenv';
import APP from './app';
import { APP_DATA_SOURCE } from './infraestrutura/database';

// Carrega variáveis de ambiente
dotenv.config();

const PORTA = process.env.PORT ? Number(process.env.PORT) : 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';

// Função para inicializar o servidor
const iniciarServidor = async () => {
    try {
        // Inicializa conexão com banco de dados apenas se as variáveis estiverem configuradas
        if (NODE_ENV !== 'test' && process.env.DB_HOST && process.env.DB_USER && process.env.DB_PASSWORD && process.env.DB_NAME) {
            await APP_DATA_SOURCE.initialize();
            
        } else {
            console.log('⚠️  Banco de dados não configurado - rodando sem conexão com BD');
        }

        // Inicia o servidor
        APP.listen(PORTA, () => {
            console.log(`🚀 Servidor rodando em http://localhost:${PORTA}`);
            console.log(`🌍 Ambiente: ${NODE_ENV}`);
            console.log(`🔒 CORS habilitado para: ${CORS_ORIGIN}`);
        });
    } catch (prm_erro) {
        console.error('❌ Erro ao inicializar servidor:', prm_erro);
        process.exit(1);
    }
};

// Inicia o servidor
iniciarServidor();

export default APP;