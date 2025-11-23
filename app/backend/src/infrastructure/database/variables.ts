import { ApplicationError } from '../../shared/errors/ApplicationError';

interface ConfigBancoDados {
  host: string;
  porta: number;
  nome: string;
  usuario: string;
  senha: string;
}

interface ConfigJWT {
  segredo: string;
  tempoExpiracao: string;
}

interface ConfigCORS {
  origem: string;
}

export interface VariaveisAmbiente {
  porta: number;
  ambienteExecucao: string;
  bancoDados: ConfigBancoDados;
  jwt: ConfigJWT;
  cors: ConfigCORS;
}

function validarVariaveisAmbiente(): VariaveisAmbiente {
  const variaveisRequeridas = [
    'PORT',
    'DB_HOST',
    'DB_PORT',
    'DB_NAME',
    'DB_USER',
    'DB_PASSWORD',
    'JWT_SECRET',
  ];

  const faltando = variaveisRequeridas.filter(
    (varNome) => !process.env[varNome]
  );

  if (faltando.length > 0) {
    throw new ApplicationError(
      `Variáveis de ambiente faltando: ${faltando.join(', ')}`,
      500
    );
  }

  return {
    porta: parseInt(process.env.PORT || '3000', 10),
    ambienteExecucao: process.env.NODE_ENV || 'development',
    bancoDados: {
      host: process.env.DB_HOST!,
      porta: parseInt(process.env.DB_PORT || '5432', 10),
      nome: process.env.DB_NAME!,
      usuario: process.env.DB_USER!,
      senha: process.env.DB_PASSWORD!,
    },
    jwt: {
      segredo: process.env.JWT_SECRET!,
      tempoExpiracao: process.env.JWT_EXPIRES_IN || '7d',
    },
    cors: {
      origem: process.env.CORS_ORIGIN || 'http://localhost:8080',
    },
  };
}

export const variaveisAmbiente: VariaveisAmbiente =
  validarVariaveisAmbiente();
