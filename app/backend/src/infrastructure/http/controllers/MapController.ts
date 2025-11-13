import { Request, Response, NextFunction } from 'express';
import { ServicoMapa } from '../../../application/MapService';

export class ControladorMapa {
  constructor(
    private readonly servicoMapa: ServicoMapa
  ) {}

  obterMapa = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const geojson = await this.servicoMapa.obterMapaCompleto();

      // Cache leve de 10 minutos
      res.setHeader('Cache-Control', 'public, max-age=600');

      return res.json(geojson);
    } catch (erro) {
      next(erro);
    }
  };
}
