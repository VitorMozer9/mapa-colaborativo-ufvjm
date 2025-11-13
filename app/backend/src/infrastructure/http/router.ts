// src/infrastructure/http/router.ts
import { Router } from 'express';

// Mapa
import { RepositorioMapaPostgres } from '../repositories/MapRepositoryImpl';
import { ServicoMapa } from '../../application/MapService';
import { ControladorMapa } from './controllers/MapController';

export const router = Router();

/**
 * COMPOSIÇÃO (injeção de dependência manual)
 */
const repositorioMapa = new RepositorioMapaPostgres();
const servicoMapa = new ServicoMapa(repositorioMapa);
const controladorMapa = new ControladorMapa(servicoMapa);

// Rotas de Mapa / POIs
router.get('/pois', controladorMapa.obterMapa);

// As outras rotas você pode ir substituindo depois:
router.post('/auth/register', (req, res) => {
  res.json({ mensagem: 'Rota de registro - em construção' });
});

router.post('/auth/login', (req, res) => {
  res.json({ mensagem: 'Rota de login - em construção' });
});

router.get('/pois/:id', (req, res) => {
  res.json({ mensagem: 'Buscar POI por ID - em construção' });
});

router.post('/pois', (req, res) => {
  res.json({ mensagem: 'Criar POI - em construção' });
});

router.post('/routing/calculate', (req, res) => {
  res.json({ mensagem: 'Calcular rota - em construção' });
});

router.get('/favorites', (req, res) => {
  res.json({ mensagem: 'Listar favoritos - em construção' });
});

router.post('/favorites', (req, res) => {
  res.json({ mensagem: 'Adicionar favorito - em construção' });
});

router.get('/events', (req, res) => {
  res.json({ mensagem: 'Listar eventos - em construção' });
});

router.get('/events/active', (req, res) => {
  res.json({ mensagem: 'Listar eventos ativos - em construção' });
});
