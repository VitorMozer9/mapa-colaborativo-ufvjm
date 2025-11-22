export class ApplicationError extends Error {
  constructor(
    public readonly mensagem: string,
    public readonly codigoStatus: number = 400
  ) {
    super(mensagem);
    this.name = 'ApplicationError';
    Error.captureStackTrace(this, this.constructor);
  }
}

// Erro não encontrado
export class NotFoundError extends ApplicationError {
  constructor(recurso: string) {
    super(`${recurso} não encontrado(a)`, 404);
    this.name = 'NotFoundError';
  }
}

// Não autorizado
export class UnauthorizedError extends ApplicationError {
  constructor(mensagem: string = 'Não autorizado') {
    super(mensagem, 401);
    this.name = 'UnauthorizedError';
  }
}

// Erro de validação
export class ValidationError extends ApplicationError {
  constructor(mensagem: string) {
    super(mensagem, 422);
    this.name = 'ValidationError';
  }
}
