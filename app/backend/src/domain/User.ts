import { Role } from './Role';

export class Usuario {
  constructor(
    public readonly id: string,
    public readonly nome: string,
    public readonly email: string,
    public readonly senhaHash: string,
    public readonly papel: Role,
    public readonly criadoEm: Date,
    public readonly atualizadoEm: Date
  ) {}

  static criar(
    nome: string,
    email: string,
    senhaHash: string,
    papel: Role = Role.VISITANTE
  ): Usuario {
    const agora = new Date();
    return new Usuario(
      crypto.randomUUID(),
      nome,
      email,
      senhaHash,
      papel,
      agora,
      agora
    );
  }

  isAdministrador(): boolean {
    return this.papel === Role.ADMINISTRADOR;
  }

  podeGerenciarConteudo(): boolean {
    return this.papel === Role.ADMINISTRADOR || this.papel === Role.PROFESSOR;
  }
}