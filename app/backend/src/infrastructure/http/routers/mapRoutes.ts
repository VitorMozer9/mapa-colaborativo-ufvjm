import { Router } from 'express';
import { RepositorioMapaPostgres } from '../../repositories/MapRepositoryImpl';
import { ServicoMapa } from '../../../application/services/MapService';
import { ControladorMapa } from '../controllers/MapController';

const router = Router();

const repositorioMapa = new RepositorioMapaPostgres();
const servicoMapa = new ServicoMapa(repositorioMapa);
const controladorMapa = new ControladorMapa(servicoMapa);

router.get('/', (req, res, next) => controladorMapa.obterMapa(req, res, next));

router.get('/config', (req, res, next) =>
  controladorMapa.obterConfiguracao(req, res, next)
);

export { router as mapRoutes };
