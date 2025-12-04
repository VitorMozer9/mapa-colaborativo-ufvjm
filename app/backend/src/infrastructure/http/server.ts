import express, {
  Express,
  Request,
  Response,
  NextFunction,
} from 'express';
import cors from 'cors';

import { variaveisAmbiente } from '../database/variables';
import {
  testarConexao,
  encerrarConexao,
} from '../database/connection';
import { Logger } from '../../shared/logger';
import { router } from './routers/router';
import { middlewareErroGlobal } from './middleware/globalError';

class Server {
  private app: Express;

  constructor() {
    this.app = express();
    this.configurarMiddlewares();
    this.configurarRotas();
    this.configurarTratamentoErros();
  }

  private configurarMiddlewares(): void {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    this.app.use(
      (req: Request, _res: Response, next: NextFunction) => {
        Logger.info(`${req.method} ${req.path}`);
        next();
      }
    );
  }

  private configurarRotas(): void {
    this.app.get('/health', (_req: Request, res: Response) => {
      res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
      });
    });

    this.app.use('/api', router);

    this.app.use((req: Request, res: Response) => {
      res.status(404).json({
        error: 'Rota não encontrada',
        path: req.path,
      });
    });
  }

  private configurarTratamentoErros(): void {
    this.app.use(middlewareErroGlobal);
  }

  async start(): Promise<void> {
    try {
      await testarConexao();

      this.app.listen(variaveisAmbiente.porta, () => {
        Logger.info(
          `Servidor rodando na porta ${variaveisAmbiente.porta}`
        );
        Logger.info(
          `Ambiente: ${variaveisAmbiente.ambienteExecucao}`
        );
        Logger.info(
          `API disponível em http://localhost:${variaveisAmbiente.porta}/api`
        );
      });
    } catch (erro) {
      Logger.error('Erro ao iniciar servidor:', erro as Error);
      process.exit(1);
    }
  }
}

process.on('SIGINT', async () => {
  Logger.info('Encerrando servidor (SIGINT)...');
  await encerrarConexao();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  Logger.info('Encerrando servidor (SIGTERM)...');
  await encerrarConexao();
  process.exit(0);
});

// Inicializa o servidor
const server = new Server();
server.start();
