import { Router } from 'express';
import { ServicoPOI } from '../../../application/services/POIService';
import { RepositorioPOIPostgres } from '../../repositories/POIRepositoryImpl';
import { ControladorPOI } from '../controllers/POIController';

const router = Router();

const repositorioPOI = new RepositorioPOIPostgres();
const servicoPOI = new ServicoPOI(repositorioPOI);
const controladorPOI = new ControladorPOI(servicoPOI);

router.get('/', (req, res, next) => controladorPOI.listarTodos(req, res, next));
router.get('/:id', (req, res, next) => controladorPOI.buscarPorId(req, res, next));
router.get('/categoria/:categoria', (req, res, next) =>
  controladorPOI.buscarPorCategoria(req, res, next)
);
router.get('/busca/proximos', (req, res, next) =>
  controladorPOI.buscarProximos(req, res, next)
);
router.get('/busca', (req, res, next) => controladorPOI.buscar(req, res, next));

router.post('/', (req, res, next) => controladorPOI.criar(req, res, next));
router.put('/:id', (req, res, next) => controladorPOI.atualizar(req, res, next));
router.delete('/:id', (req, res, next) => controladorPOI.deletar(req, res, next));

export { router as poiRoutes };
