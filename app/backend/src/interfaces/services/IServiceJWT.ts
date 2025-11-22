import { Role } from '../../domain/Role'

export interface ConteudoToken {
  usuarioId: string;
  email: string;
  papel: Role;
}

export interface IServicoJWT {
  // Gera um novo token JWT
  gerar(conteudo: ConteudoToken): string;

  // Verifica e decodifica um token
  verificar(token: string): ConteudoToken;

  // Decodifica sem validar assinatura
  decodificar(token: string): ConteudoToken | null;
}