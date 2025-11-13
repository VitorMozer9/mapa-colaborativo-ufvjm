export class AppError extends Error {
  constructor(
    public readonly message: string,
    public readonly statusCode: number = 400
  ) {
    super(message);
    this.name = 'AppError';
    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} não encontrado(a)`, 404);
    this.name = 'NotFoundError';
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Não autorizado') {
    super(message, 401);
    this.name = 'UnauthorizedError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 422);
    this.name = 'ValidationError';
  }
}