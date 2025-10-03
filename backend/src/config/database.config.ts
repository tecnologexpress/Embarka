/**
 * Configuração da conexão com banco de dados PostgreSQL
 * Utiliza variáveis de ambiente para configuração segura
 */
export const databaseConfig = {
    type: 'postgres' as const,
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5070'),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'embarka_db',
    synchronize: process.env.NODE_ENV !== 'production',
    logging: process.env.NODE_ENV === 'development',
    entities: [],
    autoLoadEntities: true,
    migrations: [__dirname + '/../migrations/*{.ts,.js}'],
    cli: {
        migrationsDir: 'src/migrations',
    },
};