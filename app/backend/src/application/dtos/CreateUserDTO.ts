import { Role } from '../../domain/Role';

export interface CriarUsuarioDTO {
  nome: string;
  email: string;
  senha: string;
  papel?: Role;
}
