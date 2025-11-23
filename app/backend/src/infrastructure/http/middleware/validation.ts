import { NextFunction, Request, Response } from 'express';
import { ValidationError } from '../../../shared/errors';

export type ValidadorRequisicao = (req: Request) => void;

export function validarRequisicao(validador: ValidadorRequisicao) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      validador(req);
      next();
    } catch (erro) {
      next(erro);
    }
  };
}

export const validarLoginBasico: ValidadorRequisicao = (req) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    throw new ValidationError('Email e senha são obrigatórios');
  }
};
