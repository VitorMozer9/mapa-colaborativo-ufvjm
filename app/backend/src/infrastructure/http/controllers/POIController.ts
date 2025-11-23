import { Request, Response, NextFunction } from 'express';
import { ServicoPOI } from '../../../application/services/POIService';
import { CategoriaPOI } from '../../../domain/POI';

export class ControladorPOI {
  constructor(private readonly servicoPOI: ServicoPOI) {}

  listarTodos = async (
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const pois = await this.servicoPOI.buscarTodos();

      res.json({
        total: pois.length,
        dados: pois,
      });
    } catch (erro) {
      next(erro);
    }
  };

  buscarPorId = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const poi = await this.servicoPOI.buscarPorId(id);

      res.json(poi);
    } catch (erro) {
      next(erro);
    }
  };

  buscarPorCategoria = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { categoria } = req.params;

      const pois = await this.servicoPOI.buscarPorCategoria(
        categoria as CategoriaPOI
      );

      res.json({
        total: pois.length,
        dados: pois,
      });
    } catch (erro) {
      next(erro);
    }
  };

  buscarProximos = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { latitude, longitude, raio } = req.query;

      const pois = await this.servicoPOI.buscarProximos(
        {
          latitude: parseFloat(latitude as string),
          longitude: parseFloat(longitude as string),
        },
        parseFloat(raio as string)
      );

      res.json({
        total: pois.length,
        dados: pois,
      });
    } catch (erro) {
      next(erro);
    }
  };

  buscar = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { termo } = req.query;
      const pois = await this.servicoPOI.buscar(termo as string);

      res.json({
        total: pois.length,
        dados: pois,
      });
    } catch (erro) {
      next(erro);
    }
  };

  criar = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const {
        nome,
        descricao,
        categoria,
        latitude,
        longitude,
        nomePredio,
        andar,
        numeroSala,
        urlImagem,
        ehAcessivel,
      } = req.body;

      const poi = await this.servicoPOI.criar(
        nome,
        descricao,
        categoria as CategoriaPOI,
        {
          latitude: Number(latitude),
          longitude: Number(longitude),
        },
        nomePredio,
        {
          andar,
          numeroSala,
          urlImagem,
          ehAcessivel,
        }
      );

      res.status(201).json(poi);
    } catch (erro) {
      next(erro);
    }
  };

  atualizar = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const dados = req.body;

      const poiAtualizado = await this.servicoPOI.atualizar(id, dados);

      res.json(poiAtualizado);
    } catch (erro) {
      next(erro);
    }
  };

  deletar = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;

      await this.servicoPOI.deletar(id);

      res.status(204).send();
    } catch (erro) {
      next(erro);
    }
  };
}
