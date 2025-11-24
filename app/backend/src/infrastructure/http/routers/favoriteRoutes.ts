import { Router } from 'express';
import { ServicoFavoritos } from '../../../application/services/FavoritesService';
import { RepositorioFavoritoPostgres } from '../../repositories/FavoriteRepositoryImpl';
import { ControladorFavoritos } from '../controllers/FavoritesController';
import { autenticarJWT } from '../middleware/authentication';

const router = Router();

const repositorioFavorito = new RepositorioFavoritoPostgres();
const servicoFavoritos = new ServicoFavoritos(repositorioFavorito);
const controladorFavoritos = new ControladorFavoritos(servicoFavoritos);

// Todas as rotas exigem usuário autenticado
router.use(autenticarJWT);

router.get('/', (req, res, next) => controladorFavoritos.listar(req as any, res, next));
router.post('/', (req, res, next) => controladorFavoritos.adicionar(req as any, res, next));
router.delete('/:id', (req, res, next) => controladorFavoritos.remover(req, res, next));

export { router as favoritesRoutes };
