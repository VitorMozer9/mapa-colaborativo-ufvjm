import { Pool, PoolConfig } from 'pg';
import { variaveisAmbiente } from './variables';
import { Logger } from '../../shared/logger';

const poolConfig: PoolConfig = {
  host: variaveisAmbiente.bancoDados.host,
  port: variaveisAmbiente.bancoDados.porta,
  database: variaveisAmbiente.bancoDados.nome,
  user: variaveisAmbiente.bancoDados.usuario,
  password: variaveisAmbiente.bancoDados.senha,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
};

export const pool = new Pool(poolConfig);

pool.on('connect', () => {
  Logger.info('Nova conexão estabelecida com o banco de dados');
});

pool.on('error', (erro) => {
  Logger.error('Erro inesperado no pool de conexões', erro);
  process.exit(-1);
});

export async function testarConexao(): Promise<void> {
  try {
    const cliente = await pool.connect();

    const resultado = await cliente.query('SELECT NOW()');
    Logger.info('Conexão com banco de dados OK', resultado.rows[0]);

    const postgis = await cliente.query('SELECT PostGIS_version()');
    Logger.info('PostGIS versão', postgis.rows[0].postgis_version);

    cliente.release();
  } catch (erro) {
    Logger.error('Erro ao conectar com banco de dados', erro as Error);
    throw erro;
  }
}

export async function encerrarConexao(): Promise<void> {
  await pool.end();
  Logger.info('Pool de conexões encerrado');
}
