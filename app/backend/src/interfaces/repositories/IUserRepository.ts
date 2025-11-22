import { Usuario  } from '../../domain/User';

export interface IRepositorioUsuario {
  buscarPorId(id: string): Promise<Usuario | null>;
  buscarPorEmail(email: string): Promise<Usuario | null>;
  criar(usuario: Usuario): Promise<Usuario>;
  atualizar(usuario: Usuario): Promise<Usuario>;
  deletar(id: string): Promise<void>;
}
