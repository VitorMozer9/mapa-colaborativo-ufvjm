import { Request, Response, NextFunction } from 'express';
import { ServicoFavoritos } from '../../../application/services/FavoritesService';

export interface RequisicaoComUsuario extends Request {
  usuarioId?: string;
}

export class ControladorFavoritos {
  constructor(private readonly servicoFavoritos: ServicoFavoritos) {}

  listar = async (
    req: RequisicaoComUsuario,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const idUsuario = req.usuarioId!;
      const favoritos =
        await this.servicoFavoritos.listarPorUsuario(idUsuario);

      res.json({
        total: favoritos.length,
        dados: favoritos,
      });
    } catch (erro) {
      next(erro);
    }
  };

  adicionar = async (
    req: RequisicaoComUsuario,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const idUsuario = req.usuarioId!;
      const { idPOI } = req.body;

      const favorito = await this.servicoFavoritos.adicionar(
        idUsuario,
        idPOI
      );

      res.status(201).json(favorito);
    } catch (erro) {
      next(erro);
    }
  };

  remover = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;

      await this.servicoFavoritos.remover(id);

      res.status(204).send();
    } catch (erro) {
      next(erro);
    }
  };
}
