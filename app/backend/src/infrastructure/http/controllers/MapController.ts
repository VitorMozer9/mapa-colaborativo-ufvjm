import { Request, Response, NextFunction } from 'express';
import { ServicoMapa } from '../../../application/services/MapService';

export class ControladorMapa {
  constructor(private readonly servicoMapa: ServicoMapa) {}

  obterMapa = async (
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const geojson = await this.servicoMapa.obterMapaCompleto();
      res.setHeader('Cache-Control', 'public, max-age=600');

      res.json(geojson);
    } catch (erro) {
      next(erro);
    }
  };
}
