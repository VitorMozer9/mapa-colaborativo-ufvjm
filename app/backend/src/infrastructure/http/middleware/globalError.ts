// src/infrastructure/http/middleware/globalError.ts
import { NextFunction, Request, Response } from 'express';
import { ApplicationError } from '../../../shared/errors';
import { Logger } from '../../../shared/logger';

export function middlewareErroGlobal(
  erro: any,
  _req: Request,
  res: Response,
  _next: NextFunction
): Response {
  if (erro instanceof ApplicationError) {
    Logger.error(`Erro de aplicação: ${erro.message}`, erro);
    return res.status(erro.statusCode).json({
      mensagem: erro.message,
      statusCode: erro.statusCode,
    });
  }

  Logger.error('Erro inesperado no servidor', erro as Error);

  return res.status(500).json({
    mensagem: 'Erro interno do servidor',
  });
}
