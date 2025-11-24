import { NextFunction, Request, Response } from 'express';
import { ServicoJWT } from './jwt';
import { ConteudoToken } from '../../interfaces/services/IServiceJWT';
import { UnauthorizedError } from '../../shared/errors';

const servicoJWT = new ServicoJWT();

export interface RequisicaoComUsuario extends Request {
  usuarioId?: string;
  usuarioEmail?: string;
  usuarioPapel?: string;
}

export function autenticarJWT(
  req: RequisicaoComUsuario,
  _res: Response,
  next: NextFunction
): void {
  const cabecalhoAutorizacao = req.headers.authorization;

  if (!cabecalhoAutorizacao || !cabecalhoAutorizacao.startsWith('Bearer ')) {
    return next(new UnauthorizedError('Token não fornecido'));
  }

  const token = cabecalhoAutorizacao.substring('Bearer '.length);

  try {
    const payload = servicoJWT.verificar<ConteudoToken>(token);

    req.usuarioId = payload.usuarioId;
    req.usuarioEmail = payload.email;
    req.usuarioPapel = payload.papel;

    next();
  } catch (erro) {
    next(erro);
  }
}
