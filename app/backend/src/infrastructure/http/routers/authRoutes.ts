// src/infrastructure/http/routers/authRoutes.ts
import { Router } from 'express';
import { ServicoAutenticacao } from '../../../application/services/AuthService';
import { ServicoCriptografiaBcrypt } from '../../security/BcryptCryptography';
import { ServicoJWT } from '../../security/jwt';
import { RepositorioUsuarioPostgres } from '../../repositories/UserRepositoryImpl';
import { ControladorAutenticacao } from '../controllers/AuthController';
import {
  validarRequisicao,
  validarLoginBasico,
} from '../middleware/validation';

const router = Router();

const repositorioUsuario = new RepositorioUsuarioPostgres();
const servicoCriptografia = new ServicoCriptografiaBcrypt();
const servicoJWT = new ServicoJWT();
const servicoAutenticacao = new ServicoAutenticacao(
  repositorioUsuario,
  servicoCriptografia,
  servicoJWT
);
const controladorAutenticacao = new ControladorAutenticacao(
  servicoAutenticacao
);

router.post('/register', (req, res, next) =>
  controladorAutenticacao.registrar(req, res, next)
);

router.post(
  '/login',
  validarRequisicao(validarLoginBasico),
  (req, res, next) =>
    controladorAutenticacao.autenticar(req, res, next)
);

export { router as authRoutes };
