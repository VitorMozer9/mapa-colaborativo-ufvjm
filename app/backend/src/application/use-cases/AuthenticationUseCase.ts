import { ServicoAutenticacao } from '../services/AuthService';
import { Role } from '../../domain/Role';
import { Usuario } from '../../domain/User';

export class RegistrarUsuarioUseCase {
  constructor(private readonly servicoAutenticacao: ServicoAutenticacao) {}

  async executar(
    nome: string,
    email: string,
    senha: string,
    papel: Role = Role.VISITANTE
  ): Promise<{ usuario: Usuario; token: string }> {
    return this.servicoAutenticacao.registrar(nome, email, senha, papel);
  }
}

export class AutenticarUsuarioUseCase {
  constructor(private readonly servicoAutenticacao: ServicoAutenticacao) {}

  async executar(
    email: string,
    senha: string
  ): Promise<{ usuario: Usuario; token: string }> {
    return this.servicoAutenticacao.autenticar(email, senha);
  }
}