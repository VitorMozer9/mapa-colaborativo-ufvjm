import { ApplicationError } from './ApplicationError';

export class NotFoundError extends ApplicationError {
  constructor(entidade: string | undefined = 'Recurso') {
    super(`${entidade} não encontrado(a)`, 404);
  }
}

export class ErroNaoEncontrado extends NotFoundError {}
