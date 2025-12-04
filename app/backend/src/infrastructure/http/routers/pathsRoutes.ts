// src/infrastructure/http/routers/pathsRoutes.ts
import { Router } from 'express';
import { ServicoCaminhos } from '../../../application/services/WalkwayService';
import { RepositorioCaminhoPostgres } from '../../repositories/walkwayRepositoryImpl';
import { ControladorCaminhos } from '../controllers/WalkwayController';

const router = Router();

const repositorioCaminho = new RepositorioCaminhoPostgres();
const servicoCaminhos = new ServicoCaminhos(repositorioCaminho);
const controladorCaminhos = new ControladorCaminhos(servicoCaminhos);

router.get('/rota/calcular', (req, res, next) => controladorCaminhos.calcularRota(req, res, next));
router.get('/:id', (req, res, next) => controladorCaminhos.buscarPorId(req, res, next));
router.post('/', (req, res, next) => controladorCaminhos.criar(req, res, next));
router.put('/:id', (req, res, next) => controladorCaminhos.atualizar(req, res, next));
router.delete('/:id', (req, res, next) => controladorCaminhos.deletar(req, res, next));

export { router as pathsRoutes };
