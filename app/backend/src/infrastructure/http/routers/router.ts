// src/infrastructure/http/routers/router.ts
import { Router } from 'express';
import { authRoutes } from './authRoutes';
import { poiRoutes } from './poiRoutes';
import { eventsRoutes } from './eventsRoutes';
import { favoritesRoutes } from './favoriteRoutes';
import { pathsRoutes } from './pathsRoutes';
import { mapRoutes } from './mapRoutes';

export const router = Router();

router.use('/auth', authRoutes);
router.use('/pois', poiRoutes);
router.use('/events', eventsRoutes);
router.use('/favorites', favoritesRoutes);
router.use('/paths', pathsRoutes);
router.use('/map', mapRoutes);
