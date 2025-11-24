import { ApplicationError } from './ApplicationError';

export class ValidationError extends ApplicationError {
  constructor(mensagem = 'Dados inválidos') {
    super(mensagem, 400);
  }
}

export class ErroValidacao extends ValidationError {}
