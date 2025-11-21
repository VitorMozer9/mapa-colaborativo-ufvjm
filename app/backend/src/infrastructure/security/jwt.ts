// src/infrastructure/security/jwt.ts
import jwt, { SignOptions } from 'jsonwebtoken';
import { env } from '../config/env';
import { Role } from '../../domain/Role';
import { UnauthorizedError } from '../../shared/errors';

export interface ConteudoToken {
  usuarioId: string;
  email: string;
  papel: Role;
}

export class JwtService {
  static gerarToken(conteudo: ConteudoToken): string {
    const opcoes: SignOptions = {
      expiresIn: env.jwt.expiresIn as SignOptions['expiresIn'],
    };

    // Cast do secret para o tipo esperado pela lib
    const segredo = env.jwt.secret as jwt.Secret;

    return jwt.sign(conteudo, segredo, opcoes);
  }

  static verificarToken(token: string): ConteudoToken {
    try {
      const segredo = env.jwt.secret as jwt.Secret;
      const decodificado = jwt.verify(token, segredo) as ConteudoToken;
      return decodificado;
    } catch (erro) {
      if (erro instanceof jwt.TokenExpiredError) {
        throw new UnauthorizedError('Token expirado');
      }
      if (erro instanceof jwt.JsonWebTokenError) {
        throw new UnauthorizedError('Token inválido');
      }
      throw new UnauthorizedError('Erro ao validar token');
    }
  }

  static decodificar(token: string): ConteudoToken | null {
    try {
      return jwt.decode(token) as ConteudoToken;
    } catch {
      return null;
    }
  }
}
