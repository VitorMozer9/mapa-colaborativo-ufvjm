import { Router } from 'express';
import { ServicoEventos } from '../../../application/services/EventService';
import { RepositorioEventoPostgres } from '../../repositories/EventRepositoryImpl';
import { ControladorEventos } from '../controllers/EventsController';

const router = Router();

const repositorioEvento = new RepositorioEventoPostgres();
const servicoEventos = new ServicoEventos(repositorioEvento);
const controladorEventos = new ControladorEventos(servicoEventos);

router.get('/', (req, res, next) =>
  controladorEventos.listarTodos(req, res, next)
);
router.get('/ativos', (req, res, next) =>
  controladorEventos.listarAtivos(req, res, next)
);
router.get('/proximos', (req, res, next) =>
  controladorEventos.listarProximos(req, res, next)
);
router.get('/poi/:idPOI', (req, res, next) =>
  controladorEventos.listarPorPOI(req, res, next)
);
router.get('/:id', (req, res, next) =>
  controladorEventos.buscarPorId(req, res, next)
);

router.post('/', (req, res, next) =>
  controladorEventos.criar(req, res, next)
);
router.put('/:id', (req, res, next) =>
  controladorEventos.atualizar(req, res, next)
);
router.delete('/:id', (req, res, next) =>
  controladorEventos.deletar(req, res, next)
);

export { router as eventsRoutes };
