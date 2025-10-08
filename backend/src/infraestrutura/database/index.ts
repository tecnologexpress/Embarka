import dotenv from 'dotenv';
import { DataSource } from 'typeorm';

// Carrega o .env.test se estiver em ambiente de teste
if (process.env.NODE_ENV === 'test') {
    dotenv.config({ path: '.env.test' });
} else {
    dotenv.config(); // Carrega o .env padrão
}

export const APP_DATA_SOURCE = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST ?? '',
    port: parseInt(process.env.DB_PORT ?? '5432'),
    username: process.env.DB_USER ?? '',
    password: process.env.DB_PASSWORD ?? '',
    database: process.env.DB_NAME ?? '',
    entities: [__dirname + '/../../**/entidade/*.{ts,js}'],
    logging: false,
    // logger: 'advanced-console', // Para ver logs mais detalhados de erros do banco de dados
    migrations: []
});

const INICIALIZAR_BANCO_DE_DADOS = async () => {
    try {
        await APP_DATA_SOURCE.initialize();
        console.log('Banco:', process.env.DB_NAME);
        console.log('Ambiente:', process.env.NODE_ENV);
        console.log('✅ Conexão com banco estabelecida!');
    } catch (prm_erro) {
        console.error('❌ Erro ao conectar com o banco:', prm_erro);
        throw prm_erro;
    }
};

// Só inicializa automaticamente se não for ambiente de teste E se as variáveis estiverem configuradas
if (process.env.NODE_ENV !== 'test' && process.env.DB_HOST && process.env.DB_USER && process.env.DB_PASSWORD && process.env.DB_NAME) {
    INICIALIZAR_BANCO_DE_DADOS();
}

export { INICIALIZAR_BANCO_DE_DADOS };