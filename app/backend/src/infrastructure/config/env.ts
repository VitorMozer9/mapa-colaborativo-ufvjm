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

interface VariaveisAmbiente {
  porta: number;
  ambienteExecucao: string;
  bancoDados: ConfigBancoDados;
  jwt: ConfigJWT;
  cors: ConfigCORS;
}

function validarVariaveisAmbiente(): VariaveisAmbiente {
  const variaveisRequeridas = [
    'PORTA',
    'DB_HOST',
    'DB_PORTA',
    'DB_NOME',
    'DB_USUARIO',
    'DB_SENHA',
    'JWT_SEGREDO'
  ];

  const faltando = variaveisRequeridas.filter(varNome => !process.env[varNome]);

  if (faltando.length > 0) {
    throw new ApplicationError(
      `Variáveis de ambiente faltando: ${faltando.join(', ')}`,
      500
    );
  }

  return {
    porta: parseInt(process.env.PORTA || '3000', 10),
    ambienteExecucao: process.env.NODE_ENV || 'development',
    bancoDados: {
      host: process.env.DB_HOST!,
      porta: parseInt(process.env.DB_PORTA || '5432', 10),
      nome: process.env.DB_NOME!,
      usuario: process.env.DB_USUARIO!,
      senha: process.env.DB_SENHA!
    },
    jwt: {
      segredo: process.env.JWT_SEGREDO!,
      tempoExpiracao: process.env.JWT_TEMPO_EXPIRACAO || '7d'
    },
    cors: {
      origem: process.env.CORS_ORIGEM || 'http://localhost:8080'
    }
  };
}