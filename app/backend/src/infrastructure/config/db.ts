import { Pool, PoolConfig } from 'pg';
import { env } from './env';
import { Logger } from '../../shared/logger';

const poolConfig: PoolConfig = {
  host: env.database.host,
  port: env.database.port,
  database: env.database.name,
  user: env.database.user,
  password: env.database.password,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
};

export const pool = new Pool(poolConfig);

pool.on('connect', () => {
  Logger.info('Nova conexão estabelecida com o banco de dados');
});

pool.on('error', (err) => {
  Logger.error('Erro inesperado no pool de conexões', err);
  process.exit(-1);
});

export async function testConnection(): Promise<void> {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    Logger.info('Conexão com banco de dados OK:', result.rows[0]);
    
    // Verifica se PostGIS está instalado
    const postgis = await client.query(
      "SELECT PostGIS_version();"
    );
    Logger.info('PostGIS versão:', postgis.rows[0].postgis_version);
    
    client.release();
  } catch (error) {
    Logger.error('Erro ao conectar com banco de dados:', error as Error);
    throw error;
  }
}

export async function closeConnection(): Promise<void> {
  await pool.end();
  Logger.info('Pool de conexões encerrado');
}