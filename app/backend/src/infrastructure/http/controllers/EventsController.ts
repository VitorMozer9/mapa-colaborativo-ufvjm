import { Request, Response, NextFunction } from 'express';
import { ServicoEventos } from '../../../application/services/EventService';

export class ControladorEventos {
  constructor(private readonly servicoEventos: ServicoEventos) {}

  listarTodos = async (
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const eventos = await this.servicoEventos.buscarTodos();

      res.json({
        total: eventos.length,
        dados: eventos,
      });
    } catch (erro) {
      next(erro);
    }
  };

  listarAtivos = async (
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const eventos = await this.servicoEventos.buscarAtivos();

      res.json({
        total: eventos.length,
        tipo: 'ativos',
        dados: eventos,
      });
    } catch (erro) {
      next(erro);
    }
  };

  listarProximos = async (
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const eventos = await this.servicoEventos.buscarProximos();

      res.json({
        total: eventos.length,
        tipo: 'proximos',
        dados: eventos,
      });
    } catch (erro) {
      next(erro);
    }
  };

  listarPorPOI = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { idPOI } = req.params;
      const eventos = await this.servicoEventos.buscarPorPOI(idPOI);

      res.json({
        total: eventos.length,
        tipo: 'por_poi',
        dados: eventos,
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
      const evento = await this.servicoEventos.buscarPorId(id);

      res.json(evento);
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
        titulo,
        descricao,
        dataInicio,
        dataFim,
        local,
        idPOI,
        urlImagem,
        urlInscricao,
      } = req.body;

      const evento = await this.servicoEventos.criar(
        titulo,
        descricao,
        new Date(dataInicio),
        new Date(dataFim),
        local,
        {
          idPOI,
          urlImagem,
          urlInscricao,
        }
      );

      res.status(201).json(evento);
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

      const eventoAtualizado = await this.servicoEventos.atualizar(
        id,
        dados
      );

      res.json(eventoAtualizado);
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

      await this.servicoEventos.deletar(id);

      res.status(204).send();
    } catch (erro) {
      next(erro);
    }
  };
}
