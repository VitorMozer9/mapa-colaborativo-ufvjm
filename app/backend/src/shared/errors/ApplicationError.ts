export class ApplicationError extends Error {
  public readonly statusCode: number;

  constructor(mensagem: string, statusCode = 500) {
    super(mensagem);
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class AppError extends ApplicationError {}
