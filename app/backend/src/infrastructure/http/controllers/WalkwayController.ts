import { Request, Response, NextFunction } from 'express';
import { ServicoCaminhos } from '../../../application/services/WalkwayService';

export class ControladorCaminhos {
  constructor(private readonly servicoCaminhos: ServicoCaminhos) {}

  listarTodos = async (
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const caminhos = await this.servicoCaminhos.buscarTodos();

      res.json({
        total: caminhos.length,
        dados: caminhos,
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
      const caminho = await this.servicoCaminhos.buscarPorId(id);

      res.json(caminho);
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
      const { nome, coordenadas, ehAcessivel } = req.body;

      const caminho = await this.servicoCaminhos.criar(
        nome,
        coordenadas,
        ehAcessivel
      );

      res.status(201).json(caminho);
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

      const caminhoAtualizado = await this.servicoCaminhos.atualizar(
        id,
        dados
      );

      res.json(caminhoAtualizado);
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

      await this.servicoCaminhos.deletar(id);

      res.status(204).send();
    } catch (erro) {
      next(erro);
    }
  };

  calcularRota = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { latOrigem, lonOrigem, latDestino, lonDestino } = req.query;

      const rota = await this.servicoCaminhos.calcularRota(
        [Number(lonOrigem), Number(latOrigem)],
        [Number(lonDestino), Number(latDestino)]
      );

      res.json(rota);
    } catch (erro) {
      next(erro);
    }
  };
}
