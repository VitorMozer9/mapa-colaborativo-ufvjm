import dotenv from 'dotenv';
import { AppError } from '../../shared/errors';

dotenv.config();

interface EnvConfig {
  port: number;
  nodeEnv: string;
  database: {
    host: string;
    port: number;
    name: string;
    user: string;
    password: string;
  };
  jwt: {
    secret: string;
    expiresIn: string;
  };
  cors: {
    origin: string;
  };
}

function validateEnv(): EnvConfig {
  const requiredVars = [
    'PORT',
    'DB_HOST',
    'DB_PORT',
    'DB_NAME',
    'DB_USER',
    'DB_PASSWORD',
    'JWT_SECRET'
  ];

  const missing = requiredVars.filter(varName => !process.env[varName]);

  if (missing.length > 0) {
    throw new AppError(
      `Variáveis de ambiente faltando: ${missing.join(', ')}`,
      500
    );
  }

  return {
    port: parseInt(process.env.PORT || '3000', 10),
    nodeEnv: process.env.NODE_ENV || 'development',
    database: {
      host: process.env.DB_HOST!,
      port: parseInt(process.env.DB_PORT || '5432', 10),
      name: process.env.DB_NAME!,
      user: process.env.DB_USER!,
      password: process.env.DB_PASSWORD!
    },
    jwt: {
      secret: process.env.JWT_SECRET!,
      expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    },
    cors: {
      origin: process.env.CORS_ORIGIN || 'http://localhost:8080'
    }
  };
}

export const env = validateEnv();