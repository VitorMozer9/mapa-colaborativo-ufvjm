import { ApplicationError } from './ApplicationError';

export class UnauthorizedError extends ApplicationError {
  constructor(mensagem = 'Não autorizado') {
    super(mensagem, 401);
  }
}
