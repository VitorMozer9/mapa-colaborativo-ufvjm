import { ServicoAutenticacao } from '../services/AuthService';
import { CriarUsuarioDTO } from '../dtos/CreateUserDTO';
import { Usuario } from '../../domain/User';

export class CasoUsoRegistrarUsuario {
  constructor(private readonly servicoAutenticacao: ServicoAutenticacao) {}

  async executar(dados: CriarUsuarioDTO): Promise<{ usuario: Usuario; token: string }> {
    const { nome, email, senha, papel } = dados;
    return this.servicoAutenticacao.registrar(nome, email, senha, papel);
  }
}
