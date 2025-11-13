import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { Role } from '../../domain/Role';
import { UnauthorizedError } from '../../shared/errors';

export interface TokenPayload {
  userId: string;
  email: string;
  role: Role;
}

export class JwtService {
  static generate(payload: TokenPayload): string {
    return jwt.sign(payload, env.jwt.secret, {
      expiresIn: env.jwt.expiresIn
    });
  }

  static verify(token: string): TokenPayload {
    try {
      const decoded = jwt.verify(token, env.jwt.secret) as TokenPayload;
      return decoded;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new UnauthorizedError('Token expirado');
      }
      if (error instanceof jwt.JsonWebTokenError) {
        throw new UnauthorizedError('Token inválido');
      }
      throw new UnauthorizedError('Erro ao validar token');
    }
  }

  static decode(token: string): TokenPayload | null {
    try {
      return jwt.decode(token) as TokenPayload;
    } catch {
      return null;
    }
  }
}