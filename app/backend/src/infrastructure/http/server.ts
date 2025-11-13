// src/infrastructure/http/server.ts
import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { env } from '../config/env';
import { testConnection, closeConnection } from '../config/db';
import { Logger } from '../../shared/logger';
import { AppError } from '../../shared/errors';
import { router } from './router';

class Server {
  private app: Express;

  constructor() {
    this.app = express();
    this.setupMiddlewares();
    this.setupRoutes();
    this.setupErrorHandling();
  }

  private setupMiddlewares(): void {
    this.app.use(cors({
      origin: env.cors.origin,
      credentials: true
    }));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    
    // Log de requisições
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      Logger.info(`${req.method} ${req.path}`);
      next();
    });
  }

  private setupRoutes(): void {
    this.app.get('/health', (req: Request, res: Response) => {
      res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
      });
    });

    this.app.use('/api', router);

    // Rota 404
    this.app.use((req: Request, res: Response) => {
      res.status(404).json({
        error: 'Rota não encontrada',
        path: req.path
      });
    });
  }

  private setupErrorHandling(): void {
    this.app.use((
      error: Error,
      req: Request,
      res: Response,
      next: NextFunction
    ) => {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          error: error.message,
          statusCode: error.statusCode
        });
      }

      Logger.error('Erro não tratado:', error);

      return res.status(500).json({
        error: 'Erro interno do servidor',
        message: env.nodeEnv === 'development' ? error.message : undefined
      });
    });
  }

  async start(): Promise<void> {
    try {
      await testConnection();
      
      this.app.listen(env.port, () => {
        Logger.info(`🚀 Servidor rodando na porta ${env.port}`);
        Logger.info(`📍 Ambiente: ${env.nodeEnv}`);
        Logger.info(`🗺️  API disponível em http://localhost:${env.port}/api`);
      });
    } catch (error) {
      Logger.error('Erro ao iniciar servidor:', error as Error);
      process.exit(1);
    }
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  Logger.info('Encerrando servidor...');
  await closeConnection();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  Logger.info('Encerrando servidor...');
  await closeConnection();
  process.exit(0);
});

// Inicializa o servidor
const server = new Server();
server.start();
