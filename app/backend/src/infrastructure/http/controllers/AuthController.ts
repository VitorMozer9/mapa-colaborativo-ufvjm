import { Request, Response, NextFunction } from 'express';
import { ServicoAutenticacao } from '../../../application/services/AuthService';
import { Role } from '../../../domain/Role';

export class ControladorAutenticacao {
  constructor(private readonly servicoAutenticacao: ServicoAutenticacao) {}

  // Registra um novo usuário
  registrar = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { nome, email, senha, papel, siap } = req.body;

      const resultado = await this.servicoAutenticacao.registrar(
        nome,
        email,
        senha,
        papel as Role,
        siap
      );

      res.status(201).json({
        usuario: {
          id: resultado.usuario.id,
          nome: resultado.usuario.nome,
          email: resultado.usuario.email,
          papel: resultado.usuario.papel,
        },
        token: resultado.token,
      });
    } catch (erro) {
      next(erro);
    }
  };

  // Autentica usuário existente
  autenticar = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { email, senha } = req.body;

      const resultado = await this.servicoAutenticacao.autenticar(
        email,
        senha
      );

      res.json({
        usuario: {
          id: resultado.usuario.id,
          nome: resultado.usuario.nome,
          email: resultado.usuario.email,
          papel: resultado.usuario.papel,
        },
        token: resultado.token,
      });
    } catch (erro) {
      next(erro);
    }
  };
}
